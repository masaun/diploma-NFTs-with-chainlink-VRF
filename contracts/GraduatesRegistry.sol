pragma solidity 0.7.6;
pragma abicoder v2;

import { DiplomaNFT } from "./DiplomaNFT.sol";

import { LinkTokenInterface } from "@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol";

//@dev - Chainlink VRF
//import { VRFConsumerBase } from "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";


/**
 * @notice - This is a smart contract for graduates registry.
 */
//contract GraduatesRegistry is VRFConsumerBase {
contract GraduatesRegistry {

    // //----------------------------
    // // RNG via Chainlink VRF
    // //----------------------------
    // bytes32 internal keyHash;
    // uint256 internal fee;

    // mapping (bytes32 => uint256) public randomNumberStored;   // [Param]: requestId -> randomness (random number) that is retrieved

    // //uint256 public randomResult;   // [Note]: Assign "randomness (randomNumber)" retrieved
    // bytes32 public requestIdUsed;    // [Note]: Assign "requestId"





    LinkTokenInterface public linkToken;

    //@dev - Variable to count total number of graduates
    uint256 graduatesCounter;

    struct Graduate {
        bytes32 graduateId;              // [NOTE]: This graduate ID is random number that is retrieved via Chainlink VRF
        uint256 randomNumberOfGraduate;  // [NOTE]: Random number that is retrieved via Chainlink VRF
        uint256 diplomaNFTTokenId; // [NOTE]: Token ID of the DiplomaNFT 
        string graduateName;
        address graduateAddress;
    }
    mapping(bytes32 => Graduate) public graduates;  // [Key]: Gradudate ID (Request ID) -> The Graduate struct

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
        LinkTokenInterface _linkToken
        // address _vrfCoordinator, 
        // address _link, 
        // bytes32 _keyHash, 
        // uint _fee
    ) 
        public 
        //VRFConsumerBase(_vrfCoordinator, _link) 
    {
        linkToken = _linkToken;
        // keyHash = _keyHash;
        // fee = _fee;
    }

    /**
     * @dev - A new graduate is registered by owner of each college or university.
     */
    function registerNewGraduate(
        DiplomaNFT _diplomaNFT, 
        bytes32 newGraduateId,  // [NOTE]: This is a requestID called back from VRF when requesting a random number
        uint256 randomNumberOfNewGraduate,
        string memory newGraduateName, 
        address newGraduateAddress
    ) public returns (bool) {
        //@dev - Contract instance
        DiplomaNFT diplomaNFT = _diplomaNFT;
        address DIPLOMA_NFT = address(diplomaNFT);

        //@dev - Check whether requestId and randomNumber given are true or not
        uint256 randomNumberOfGraduateStored = diplomaNFT.getRandomNumberStored(newGraduateId);
        require(randomNumberOfNewGraduate == randomNumberOfGraduateStored, "A random number of new graduate given must be correspond to a random number stored");

        //@dev - Mint a new DiplomaNFT
        diplomaNFT.mintDiplomaNFT(newGraduateAddress);

        //@dev - Store data of a new graduate
        Graduate storage graduate = graduates[newGraduateId];
        graduate.graduateId = newGraduateId;  // [NOTE]: This is a requestID called back from VRF when requesting a random number
        graduate.randomNumberOfGraduate = randomNumberOfNewGraduate;
        graduate.diplomaNFTTokenId = diplomaNFT.getCurrentTokenId() - 1; // [NOTE]: Token ID of the DiplomaNFT
        graduate.graduateName = newGraduateName;
        graduate.graduateAddress = newGraduateAddress;

        //@dev - Count up total number of graduates
        graduatesCounter++;
    }


    //----------------
    // Getter methods
    //----------------
    
    /**
     * @dev - Get a graduate data
     * @param graduateId - requestId that is called back when get response from Chainlink-VRF
     */
    function getGraduate(bytes32 graduateId) public view returns (Graduate memory _graduate) {
        return graduates[graduateId];
    }


    //----------------------------
    // RNG via Chainlink VRF
    //----------------------------

    /**
     * Requests randomness
     */
    // function getRandomNumber() public returns (bytes32 requestId) {
    //     LINK.transferFrom(msg.sender, address(this), fee);  // 1 LINK

    //     require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
    //     return requestRandomness(keyHash, fee);
    // }

    /**
     * Callback function used by VRF Coordinator
     */
    // function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    //     requestIdUsed = requestId;

    //     //randomResult = randomness;
    //     randomNumberStored[requestId] = randomness;
    // }

    /**
     * Get a existing random number stored
     */
    // function getRandomNumberStored(bytes32 requestId) public view returns (uint256 _randomNumberStored) {
    //     return randomNumberStored[requestId];
    // }

}