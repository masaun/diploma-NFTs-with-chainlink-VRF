const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Create the LINK token contract interface on Kovan or Rinkeby or Polygon-Mumbai
    const LINK_TOKEN = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"    // Polygon-Mumbai
    //const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"    // Kovan
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.6/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)

    //@dev - Get the contract to deploy
    //const DiplomaNFT = await ethers.getContractFactory("DiplomaNFT")
    //const DiplomaNFT = await DiplomaNFT.deploy()

    // [NOTE]: Deployed-address of the DiplomaNFT.sol on Kovan is "0x5d41a0292A7381321A65d430Dda70a7b433a49B5"
    //@dev - Deployed-address of the DiplomaNFT.sol
    const DIPLOMA_NFT = "0x328D4Fb130c06c9901b564945d772cA4bd6f7CBb"    // Polygon-Mumbai
    //const DIPLOMA_NFT = "0x6e50a2Ae6d59c60f9b9672A49b2048360cBaf26C"  // Kovan
    
    const diplomaNFT = await ethers.getContractAt("DiplomaNFT", DIPLOMA_NFT)
    console.log("Deployed-address of the DiplomaNFT.sol on Polygon-Mumbai", diplomaNFT.address) 
    //console.log("Deployed-address of the DiplomaNFT.sol on Kovan", diplomaNFT.address) 

    //@dev - Test getRandomNumber()
    console.log('Should successfully make an external random number request')

    const linkAmount = ethers.utils.parseEther('0.1')  // 0.1 LINK
    const txReceipt1 = await linkToken.approve(DIPLOMA_NFT, linkAmount) // [Result]: Success
    console.log(`\n txReceipt1 of linkToken.approve(): ${ JSON.stringify(txReceipt1, null, 2) }`)

    /**
     * [NOTE]: GasFee = GasLimit (Gas Unit) * GasPrice
     *         eg). 21,000 * 200 = 4,200,000 gwei or 0.0042 ETH
     */
    //@dev - Gas Fee the best to call getRandomNumber method: gasLimit (12500000 wei) * gasPrice (10000000000 wei = 10 Gwei) = 0.001 ETH 
    const transaction = await diplomaNFT.getRandomNumber({ gasLimit: 12500000, gasPrice: 10000000000 })  // Polygon-Mumbai
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
