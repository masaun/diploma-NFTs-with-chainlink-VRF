pragma solidity 0.7.6;
pragma abicoder v2;

import { DiplomaNFT } from "./DiplomaNFT.sol";

import { LinkTokenInterface } from "@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol";


/**
 * @notice - This is a smart contract for graduates registry.
 */
contract GraduatesRegistry {

    LinkTokenInterface public linkToken;

    //@dev - Variable to count total number of graduates
    uint256 graduatesCounter;

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
    constructor(LinkTokenInterface _linkToken) public {
        linkToken = _linkToken;
    }

    /**
     * @dev - A new graduate is registered by owner of each college or university.
     */
    function registerNewGraduate(DiplomaNFT _diplomaNFT, address graduate, uint256 feeAmount) public returns (bool) {
        //@dev - $LINK Token in order to send a request of random number to Chainlink-VRF
        //@dev - [NOTE]: In advance, a user who execute this method must approve spending $LINK Token by this contract
        //uint256 feeAmount = 1e17;  // 0.1 LINK
        linkToken.transferFrom(msg.sender, address(this), feeAmount);

        //@dev - Contract instance
        DiplomaNFT diplomaNFT = _diplomaNFT;

        //@dev - Count up total number of graduates
        graduatesCounter++;

        // [Todo]: Create a new graduates ID that is a requestId which was used for retrieving RN (Random Number) via Chainlink-VRF 
        bytes32 newGraduateId = diplomaNFT.mintDiplomaNFT(graduate);  // [NOTE]: Returned-value is "requestId" 

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