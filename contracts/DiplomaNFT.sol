pragma solidity 0.7.6;

//@dev - Chainlink VRF
import { VRFConsumerBase } from "@chainlink/contracts/src/v0.7/VRFConsumerBase.sol";
//import { VRFConsumerBase } from "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

//@dev - NFT (ERC721)
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";


/**
 * @notice - This is a smart contract that manage the Diploma NFTs using RNG via VRF 
 */
contract DiplomaNFT is VRFConsumerBase, ERC721, Ownable {

    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;   // [Note]: Assign "randomness (randomNumber)" retrieved
    bytes32 public requestIdUsed;  // [Note]: Assign "requestId"

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     * Fee: 0.1 LINK     * 
     */
    constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint _fee)
        VRFConsumerBase(_vrfCoordinator, _link) 
        ERC721("Diploma NFT", "DIPLOMA")
        public
    {
        keyHash = _keyHash;
        fee = _fee;
    }

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
        randomResult = randomness;
    }

}