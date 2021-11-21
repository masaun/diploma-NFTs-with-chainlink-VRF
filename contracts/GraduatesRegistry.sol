pragma solidity 0.7.6;
pragma abicoder v2;

import { DiplomaNFT } from "./DiplomaNFT.sol";

/**
 * @notice - This is a smart contract for graduates registry.
 */
contract GraduatesRegistry {

    //@dev - Variable to count total number of graduates
    uint256 graduatesCounter;

    //@dev - Contract instance
    DiplomaNFT public immutable diplomaNFT;

    struct Graduate {
        bytes32 graduateId;        // [NOTE]: This graduate ID is random number that is retrieved via Chainlink VRF
        bytes32 diplomaNFTTokenId; // [NOTE]: Token ID of the DiplomaNFT 
        string graduateName;
        address graduateAddress;
    }
    mapping(bytes32 => Graduate) public graduates;  // [Key]: Gradudate ID -> The Graduate struct

    /**
     * @dev - Constructor 
     */
    constructor(DiplomaNFT _diplomaNFT) public {
        diplomaNFT = _diplomaNFT;
    }

    /**
     * @dev - Register a new graduate
     */
    function registerNewGraduate() public returns (bool) {
        //@dev - Count up total number of graduates
        graduatesCounter++;

        // [Todo]: Create a new graduates ID that is a requestId which was used for retrieving RN (Random Number) via Chainlink-VRF 
        bytes32 newGraduateId = diplomaNFT.getRandomNumber();  // [NOTE]: Returned-value is "requestId" 

        // [Todo]: Assign values into each properties of the Graduate struct
        bytes32 newDiplomaNFTTokenId; // [NOTE]: Token ID of the DiplomaNFT 
        string memory newGraduateName;
        address newGraduateAddress;

        // [Todo]: Store data of a new graduate
        Graduate storage graduate = graduates[newGraduateId];
        graduate.graduateId = newGraduateId;
        graduate.diplomaNFTTokenId = newDiplomaNFTTokenId;
        graduate.graduateName = newGraduateName;
        graduate.graduateAddress = newGraduateAddress;
    }


    //----------------
    // Getter methods
    //----------------
    function getGraduate(bytes32 graduateId) public view returns (Graduate memory _graduate) {
        return graduates[graduateId];
    }


}