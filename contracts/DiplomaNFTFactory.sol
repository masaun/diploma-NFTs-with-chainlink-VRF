pragma solidity 0.7.6;

import { DiplomaNFT } from "./DiplomaNFT.sol";

/**
 * @notice - This is a smart contract that manage the DiplomaNFT.sol
 */
contract DiplomaNFTFactory {

    //@dev - Variable for getting random number via Chainlink VRF
    address internal vrfCoordinator; 
    bytes32 internal keyHash;
    uint256 internal fee;

    //@dev - LINK Token address
    address internal link;

    //@dev - Created-contract address of DiplomaNFTs are assigned into this variable.
    address[] diplomaNFTsList;

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
        address _vrfCoordinator, 
        address _link, 
        bytes32 _keyHash, 
        uint _fee
    ) 
        public
    {
        vrfCoordinator = _vrfCoordinator;
        link = _link;
        keyHash = _keyHash;
        fee = _fee;
    }

    /**
     * @dev - Create a new DiplomaNFT
     */ 
    function createNewDiplomaNFT(
        string memory _diplomaNFTName,
        string memory _diplomaNFTSymbol
    ) public returns (DiplomaNFT _newDiplomaNFT) {
        DiplomaNFT newDiplomaNFT = new DiplomaNFT(_diplomaNFTName, _diplomaNFTSymbol, vrfCoordinator, link, keyHash, fee);
        address NEW_DIPLOMA_NFT = address(newDiplomaNFT);

        diplomaNFTsList.push(NEW_DIPLOMA_NFT);

        return newDiplomaNFT;
    }

}