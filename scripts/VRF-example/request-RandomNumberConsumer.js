const { ethers } = require("hardhat")


async function main() {

    console.log('Should successfully make an external random number request')

    //@dev - Create the LINK token contract interface on Kovan
    const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.6/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)

    // [NOTE]: Deployed-address of the RandomNumberConsumer.sol on Kovan is "0x5d41a0292A7381321A65d430Dda70a7b433a49B5"

    //@dev - Get the contract to deploy
    const RANDOM_NUMBER_CONSUMER = "0x5d41a0292A7381321A65d430Dda70a7b433a49B5"
    //const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    //const randomNumberConsumer = await RandomNumberConsumer.deploy()
    const randomNumberConsumer = await ethers.getContractAt("RandomNumberConsumer", RANDOM_NUMBER_CONSUMER)
    console.log("Deployed-address of the RandomNumberConsumer.sol on Kovan", randomNumberConsumer.address) 


    // const provider = new ethers.providers.JsonRpcProvider()
    // const signer = provider.getSigner()
    // const randomNumberConsumerWithSigner = randomNumberConsumer.connect(signer)
    // console.log('randomNumberConsumerWithSigner: ', randomNumberConsumerWithSigner)

    //@dev - Test getRandomNumber()
    console.log('Should successfully make an external random number request')

    const linkAmount = ethers.utils.parseEther('0.1')  // 0.1 LINK
    const txReceipt1 = await linkToken.approve(RANDOM_NUMBER_CONSUMER, linkAmount) // [Result]: Success
    console.log(`\n txReceipt1 of linkToken.approve(): ${ JSON.stringify(txReceipt1, null, 2) }`)

    const transaction = await randomNumberConsumer.getRandomNumber({ gasLimit: 210640, gasPrice: 100000000000 })  /// [NOTE]: Gas units (limit) * Gas price per unit:  eg). 21,000 * 200 = 4,200,000 gwei or 0.0042 ETH
    //const transaction = await randomNumberConsumer.getRandomNumber({ gasLimit: 250000, gasPrice: 10000000000000 })  /// [NOTE]: This gasPrice is 10,000,000,000,000 wei (=10,000 Gwei) 
    console.log(`\n transaction: ${ JSON.stringify(transaction, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const tx_receipt = await transaction.wait()
    console.log(`\n tx_receipt: ${ JSON.stringify(tx_receipt, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"
    
    const requestId = tx_receipt.events[2].topics[1]
    console.log("=== requestId ===", requestId)

    ///@dev - Check log of callback ("requestId" that is used and "randomNumber" that is retrieved via VRF)
    let _requestIdUsed = await randomNumberConsumer.requestIdUsed()
    console.log('=== requestIdUsed ===', String(_requestIdUsed))

    let _randomResult = await randomNumberConsumer.randomResult()
    console.log('=== randomResult of getRandomNumber() via fulfillRandomness() of the VRFConsumerBase.sol ===', String(_randomResult))
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
