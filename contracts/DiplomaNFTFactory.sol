pragma solidity 0.7.6;

import { DiplomaNFT } from "./DiplomaNFT.sol";

/**
 * @notice - This is a smart contract that manage the DiplomaNFT.sol
 */
contract DiplomaNFTFactory {

    //@dev - Created-contract address of DiplomaNFTs are assigned into this variable.
    address[] diplomaNFTsList;

    constructor() public {}

    // [Todo]: Makes name and symble of the DiplomaNFT dynamic.
    function createNewDiplomaNFT(address _vrfCoordinator, address _link, bytes32 _keyHash, uint _fee) public returns (DiplomaNFT _newDiplomaNFT) {
        DiplomaNFT newDiplomaNFT = new DiplomaNFT(_vrfCoordinator, _link, _keyHash, _fee);
        address NEW_DIPLOMA_NFT = address(newDiplomaNFT);

        diplomaNFTsList.push(NEW_DIPLOMA_NFT);

        return newDiplomaNFT;
    }

}