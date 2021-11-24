pragma solidity 0.7.6;

//@dev - Chainlink VRF
import { VRFConsumerBase } from "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";

//@dev - NFT (ERC721)
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";


/**
 * @notice - This is a smart contract that manage the Diploma NFTs using RNG via VRF 
 */
//contract DiplomaNFT is ERC721, Ownable {
contract DiplomaNFT is VRFConsumerBase, ERC721, Ownable {

    //----------------------------
    // RNG via Chainlink VRF
    //----------------------------
    bytes32 internal keyHash;
    uint256 internal fee;

    mapping (bytes32 => uint256) public randomNumberStored;   // [Param]: requestId -> randomness (random number) that is retrieved

    //uint256 public randomResult;   // [Note]: Assign "randomness (randomNumber)" retrieved
    bytes32 public requestIdUsed;    // [Note]: Assign "requestId"


    //--------------------------------
    // NFT (ERC721) related method
    //--------------------------------
    uint256 public tokenCounter;  

    mapping(string => string) public diplomaToDiplomaURI;

    event DiplomaNFTMinted (address indexed to, uint indexed tokenId);


    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     * Fee: 0.1 LINK     * 
     */
    constructor(
        string memory _diplomaNFTName,
        string memory _diplomaNFTSymbol,
        address _vrfCoordinator, 
        address _link, 
        bytes32 _keyHash, 
        uint _fee
    )
        VRFConsumerBase(_vrfCoordinator, _link) 
        ERC721(_diplomaNFTName, _diplomaNFTSymbol)
        public
    {
        keyHash = _keyHash;
        fee = _fee;
    }


    //----------------------------
    // RNG via Chainlink VRF
    //----------------------------

    /**
     * Requests randomness
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        LINK.transferFrom(msg.sender, address(this), fee);  // 1 LINK

        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        requestIdUsed = requestId;

        //randomResult = randomness;
        randomNumberStored[requestId] = randomness;
    }


    //--------------------------------
    // NFT (ERC721) related method
    //--------------------------------

    /**
     * @dev - Mint a new Diploma NFT.
     * @param graduate - "to" address that NFT minted will be transferred. Eligible address assigned is a new graduate's address 
     */
    //function mintDiplomaNFT(address graduate) public returns (bool) {
    function mintDiplomaNFT(address graduate) public returns (bytes32 _requestId) {
        _safeMint(graduate, tokenCounter);      // [NOTE]: In case of this, a receiver of a new Diploma NFT minted is "graduate" address specified.
        //_safeMint(msg.sender, tokenCounter);  // [NOTE]: In case of this, mintDiplomaNFT() is called from the GraduatesRegistry.sol and therefore "msg.sender" is the GraduatesRegistry.sol and the GraduatesRegistry.sol will receive a new Diploma NFT minted. 
        
        tokenCounter = tokenCounter + 1;

        bytes32 requestId = getRandomNumber(); // [Error]: This row is cause of error

        emit DiplomaNFTMinted(msg.sender, tokenCounter);

        return requestId;
    }

    function setDiplomaURI(string memory diploma, string memory tokenUri, uint256 tokenId) public {
        diplomaToDiplomaURI[diploma] = tokenUri;   // [Todo]: Fix
        // overRideTokenIdToWeatherURI[tokenId] = tokenUri;
    }

    function tokenURI(uint256 tokenId) public view override (ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    }

    /**
     * Get a existing random number stored
     */
    function getRandomNumberStored(bytes32 requestId) public view returns (uint256 _randomNumberStored) {
        return randomNumberStored[requestId];
    }

}