const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Deployed-addresses
    const GRADUATES_REGISTRY = "0xc4d5A87471185eB469bd86c8758061393E22a31d" // Polygon-Mumbai
    const DIPLOMA_NFT = "0x328D4Fb130c06c9901b564945d772cA4bd6f7CBb"        // Polygon-Mumbai
    //const DIPLOMA_NFT = "0x6e50a2Ae6d59c60f9b9672A49b2048360cBaf26C"      // Kovan
    
    const graduatesRegistry = await ethers.getContractAt("GraduatesRegistry", GRADUATES_REGISTRY)
    console.log("Deployed-address of the GraduatesRegistry.sol on Polygon-Mumbai", graduatesRegistry.address) 


    //@dev - registerNewGraduate()
    //@dev - Gas Fee the best to call getRandomNumber method: gasLimit (12500000 wei) * gasPrice (10000000000 wei = 10 Gwei) = 0.001 ETH 
    console.log('registerNewGraduate() - Should successfully execute registerNewGraduate()')
    const transaction = await graduatesRegistry.registerNewGraduate(DIPLOMA_NFT, { gasLimit: 12500000, gasPrice: 10000000000 })  // Polygon-Mumbai
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
