const { ethers } = require("hardhat")


async function main() {

    console.log('Should successfully make an external random number request')

    //@dev - Create the LINK token contract interface on Kovan
    const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.6/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)

    // [NOTE]: Deployed-address of the RandomNumberConsumer.sol on Kovan is "0x082A507620b33407151a3C3890069D6B8a6ad379"

    //@dev - Get the contract to deploy
    const RANDOM_NUMBER_CONSUMER = "0x082A507620b33407151a3C3890069D6B8a6ad379"
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

    //@dev - Test of just transferreing LINK
    const to = "0x082A507620b33407151a3C3890069D6B8a6ad379"   // [NOTE]: This destination address is the contract address of the RandomNumberConsumer.sol
    const amount = linkAmount
    let txReceipt2 = await linkToken.transfer(to, linkAmount)
    console.log(`\n txReceipt2 of linkToken.transfer(): ${ JSON.stringify(txReceipt2, null, 2) }`)

    const transaction = await randomNumberConsumer.getRandomNumber({ gasLimit: 2500000, gasPrice: 5 })
    console.log(`\n transaction: ${ JSON.stringify(transaction, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    //const tx_receipt = await transaction.wait()
    console.log(`\n tx_receipt: ${ JSON.stringify(tx_receipt, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"
    
    //const requestId = tx_receipt.events[2].topics[1]
    //const requestId = await JSON.stringify(tx_receipt).events
    //const requestId = JSON.stringify(tx_receipt).events[2].topics[1]
    //console.log("requestId: ", requestId)

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
