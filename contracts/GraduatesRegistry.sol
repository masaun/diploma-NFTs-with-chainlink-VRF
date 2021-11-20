pragma solidity 0.7.6;
pragma abicoder v2;

import { DiplomaNFT } from "./DiplomaNFT.sol";

/**
 * @notice - This is a smart contract for graduates registry.
 */
contract GraduatesRegistry {

    struct Graduate {
        bytes32 graduateId;        // [NOTE]: This graduate ID is random number that is retrieved via Chainlink VRF
        bytes32 diplomaNFTTokenId; // [NOTE]: Token ID of the DiplomaNFT 
        string graduateName;
        address graduateAddress;
    }
    mapping(bytes32 => Graduate) public graduates;  // [Key]: Gradudate ID -> The Graduate struct


    constructor() public {
        // [Todo]:
    }


    //----------------
    // Getter methods
    //----------------
    function getGraduate(bytes32 graduateId) public view returns (Graduate memory _graduate) {
        return graduates[graduateId];
    }


}