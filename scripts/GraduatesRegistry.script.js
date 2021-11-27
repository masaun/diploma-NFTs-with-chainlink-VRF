const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 * @notice - This script is that getRandomNumber() and mintDiplomaNFT() are executed separately.
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Deployed-addresses
    const DIPLOMA_NFT_FACTORY = "0xE1538ee65808dC992c22fd656C4CFf08350BBb9F"  // Kovan
    const GRADUATES_REGISTRY = "0xAcEa79FC1cF702C6A7F39823905d988E69784AD3"   // Kovan
    //const GRADUATES_REGISTRY = "0xc4d5A87471185eB469bd86c8758061393E22a31d" // Polygon-Mumbai
    
    const diplomaNFTFactory = await ethers.getContractAt("DiplomaNFTFactory", DIPLOMA_NFT_FACTORY)
    const graduatesRegistry = await ethers.getContractAt("GraduatesRegistry", GRADUATES_REGISTRY)
    console.log("Deployed-address of the DiplomaNFTFactory.sol on Kovan: ", diplomaNFTFactory.address) 
    console.log("Deployed-address of the GraduatesRegistry.sol on Kovan: ", graduatesRegistry.address) 


    ///-------------------------------------------------------
    /// Create a new DiplomaNFT
    ///-------------------------------------------------------
    const _diplomaNFTName = "Diploma of the East University"
    const _diplomaNFTSymbol = "DIPLOMA_OF_EAST_UNIVERSITY" 
    let txReceipt = await diplomaNFTFactory.createNewDiplomaNFT(_diplomaNFTName, _diplomaNFTSymbol)

    //@dev - Using getDiplomaNFTAddressCreatedTheLatest() instead of using eventLog of "DiplomaNFTCreated" in order to retrieve a DiplomaNFT's address
    let DIPLOMA_NFT = await diplomaNFTFactory.getDiplomaNFTAddressCreatedTheLatest()
    console.log(`=== DIPLOMA_NFT ===`, DIPLOMA_NFT)

    //@dev - Create a DiplomaNFT instance
    const diplomaNFT = await ethers.getContractAt("DiplomaNFT", DIPLOMA_NFT)



    ///----------------------------------------------------------
    /// Get a random number directly by using getRandomNumber()
    ///----------------------------------------------------------

    const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"  // Kovan
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)
    const linkAmount = ethers.utils.parseEther('1')      // 1 LINK
    //const linkAmount = ethers.utils.parseEther('0.1')  // 0.1 LINK

    ///@dev - Get a random number
    let txReceipt4 = await linkToken.approve(DIPLOMA_NFT, linkAmount) // 1 LINK as a fee to request a randomNumber via VRF
    const tx_receipt_4 = await txReceipt4.wait()  /// [NOTE]: Next step must wait until linkToken.approve() is finished

    let txReceipt3 = await diplomaNFT.getRandomNumber({ gasLimit: 2500000, gasPrice: 100000000000 })
    const tx_receipt_3 = await txReceipt3.wait()
    console.log(`\n tx_receipt_3: ${ JSON.stringify(tx_receipt_3, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    ///@dev - Wait 90 seconds for calling a result of requesting a random number retrieved.
    await new Promise(resolve => setTimeout(resolve, 90000))  // Waiting for 90 seconds (90000 mili-seconds)

    ///@dev - Check log of callback ("requestId" that is used and "randomNumber" that is retrieved via VRF)
    let _requestIdCalledBack = await diplomaNFT.requestIdCalledBack()
    console.log('=== requestIdCalledBack ===', String(_requestIdCalledBack))

    //@dev - Retrieve a random number by assigning a requestId called back
    let _randomNumberStored = await diplomaNFT.randomNumberStored(_requestIdCalledBack)
    console.log('=== randomNumberStored ===', String(_randomNumberStored))


    ///------------------------------------------------------------------------------------------------------------
    /// Register a new graduate with requestId and random number that are retrieved and stored via Chainlink-VRF
    ///------------------------------------------------------------------------------------------------------------

    //@dev - Gas Fee the best to call getRandomNumber method: gasLimit (12500000 wei) * gasPrice (10000000000 wei = 10 Gwei) = 0.001 ETH 
    const txReceipt2 = await linkToken.approve(GRADUATES_REGISTRY, linkAmount)
    const tx_receipt_2 = await txReceipt2.wait()  /// [NOTE]: Next step must wait until linkToken.approve() is finished
    console.log(`\n txReceipt that linkToken.approve() for the GraduatesRegistry.sol: ${ JSON.stringify(txReceipt2, null, 2) }`)

    const newGraduateId = _requestIdCalledBack
    const randomNumberOfNewGraduate = _randomNumberStored
    const newGraduateName = "Bob Jones"
    const newGraduateAddress = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1" /// [NOTE]: This is an example of wallet address of a new graduate. 
    const transaction = await graduatesRegistry.registerNewGraduate(DIPLOMA_NFT, 
                                                                    newGraduateId,
                                                                    randomNumberOfNewGraduate,
                                                                    newGraduateName, 
                                                                    newGraduateAddress, 
                                                                    { gasLimit: 12500000, gasPrice: 10000000000 })  // Kovan
    console.log(`\n transaction: ${ JSON.stringify(transaction, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const tx_receipt = await transaction.wait()
    console.log(`\n tx_receipt: ${ JSON.stringify(tx_receipt, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"
}


/**
 * @dev - Execute scripts
 */ 
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
