const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Deployed-addresses
    const DIPLOMA_NFT_FACTORY = "0x588e6addEa18751e7d114aC405F317Bfa4EE91c7"  // Kovan    
    const GRADUATES_REGISTRY = "0xE42BD27BF6Ee139179Ab0e806C15b1c67BceB952"   // Kovan
    //const GRADUATES_REGISTRY = "0xc4d5A87471185eB469bd86c8758061393E22a31d" // Polygon-Mumbai
    
    const diplomaNFTFactory = await ethers.getContractAt("DiplomaNFTFactory", DIPLOMA_NFT_FACTORY)
    const graduatesRegistry = await ethers.getContractAt("GraduatesRegistry", GRADUATES_REGISTRY)
    console.log("Deployed-address of the DiplomaNFTFactory.sol on Kovan: ", diplomaNFTFactory.address) 
    console.log("Deployed-address of the GraduatesRegistry.sol on Kovan: ", graduatesRegistry.address) 


    //@dev - Create a new DiplomaNFT
    const _diplomaNFTName = "Diploma of the East University"
    const _diplomaNFTSymbol = "DIPLOMA_OF_EAST_UNIVERSITY" 
    let txReceipt = await diplomaNFTFactory.createNewDiplomaNFT(_diplomaNFTName, _diplomaNFTSymbol)
    let DIPLOMA_NFT = "<Should be assigned from eventLog>"
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
