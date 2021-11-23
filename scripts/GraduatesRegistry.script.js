const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Deployed-addresses
    const DIPLOMA_NFT_FACTORY = "0x7c449C34F1179E9EfAf7A8D99515D470BaF70651"  // Kovan    
    const GRADUATES_REGISTRY = "0x14C722A813C359332d1d9D9E5F897a89b6d11B45"   // Kovan
    //const GRADUATES_REGISTRY = "0xc4d5A87471185eB469bd86c8758061393E22a31d" // Polygon-Mumbai
    
    const diplomaNFTFactory = await ethers.getContractAt("DiplomaNFTFactory", DIPLOMA_NFT_FACTORY)
    const graduatesRegistry = await ethers.getContractAt("GraduatesRegistry", GRADUATES_REGISTRY)
    console.log("Deployed-address of the DiplomaNFTFactory.sol on Kovan: ", diplomaNFTFactory.address) 
    console.log("Deployed-address of the GraduatesRegistry.sol on Kovan: ", graduatesRegistry.address) 


    //@dev - Create a new DiplomaNFT
    const _diplomaNFTName = "Diploma of the East University"
    const _diplomaNFTSymbol = "DIPLOMA_OF_EAST_UNIVERSITY" 
    let txReceipt = await diplomaNFTFactory.createNewDiplomaNFT(_diplomaNFTName, _diplomaNFTSymbol)

    // const currentProvider = ethers.getDefaultProvider(42)  // ChainID=42 is Kovan   
    // currentProvider.once(txReceipt.value.hash, (transaction) => {
    //     console.log('=== eventLog (transaction) ===', transaction)
    // })
 
    // let eventLog
    // diplomaNFTFactory.on("DiplomaNFTCreated", (newDiplomaNFT, eventLog) => {
    //     console.log(`An event of "DiplomaNFTCreated" is executed: `, newDiplomaNFT, eventLog)
    // })

    let DIPLOMA_NFT = await diplomaNFTFactory.getDiplomaNFTAddressCreatedTheLatest()
    console.log(`=== DIPLOMA_NFT ===`, DIPLOMA_NFT)


    //@dev - Register a new graduate
    //@dev - Gas Fee the best to call getRandomNumber method: gasLimit (12500000 wei) * gasPrice (10000000000 wei = 10 Gwei) = 0.001 ETH 
    console.log('registerNewGraduate() - Should successfully execute registerNewGraduate()')
    const transaction = await graduatesRegistry.registerNewGraduate(DIPLOMA_NFT, { gasLimit: 12500000, gasPrice: 10000000000 })  // Kovan
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
