pragma solidity ^0.8.7;

import { VRFConsumerBase } from "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/**
 * @notice - This is a smart contract that manage the Diploma NFTs using RNG via VRF 
 */
contract DiplomaNFT is VRFConsumerBase {
    // [Todo]:
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
    constructor(address _vrfCoordinator,
                address _link,
                bytes32 _keyHash,
                uint _fee)
        VRFConsumerBase(
            _vrfCoordinator, // VRF Coordinator
            _link  // LINK Token
        ) public
    {
        keyHash = _keyHash;
        fee = _fee;
    }

}