pragma solidity 0.7.6;

import { DiplomaNFT } from "./DiplomaNFT.sol";

/**
 * @notice - This is a smart contract for graduates registry.
 */
contract GraduatesRegistry {

    struct Graduate {
        bytes32 graduateId;  // [NOTE]: This graduate ID is random number that is retrieved via Chainlink VRF
        string graduateName;
        address graduateAddress;
    }
    mapping(bytes32 => Graduate) public graduates;  // [Key]: Gradudate ID -> The Graduate struct

    constructor() public {
        // [Todo]:
    }


}