const { ethers } = require("hardhat")


async function main() {
    //@dev - Create the LINK token contract interface on Rinkeby    
    const LINK_TOKEN = "0x01be23585060835e02b77ef475b0cc51aa1e0709"
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.6/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)


    // [NOTE]: Deployed-address of the RandomNumberConsumer.sol on Rinkeby is "0x461f9bD7A33B9532a19BC7B7834063c313058e32"

    //@dev - Get the contract to deploy
    const RANDOM_NUMBER_CONSUMER = "0x461f9bD7A33B9532a19BC7B7834063c313058e32"
    //const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    //const randomNumberConsumer = await RandomNumberConsumer.deploy()
    const randomNumberConsumer = await ethers.getContractAt("RandomNumberConsumer", RANDOM_NUMBER_CONSUMER)


    console.log("Deployed-address of the RandomNumberConsumer.sol on Rinkeby", randomNumberConsumer.address)  // [Result]: "0x461f9bD7A33B9532a19BC7B7834063c313058e32"

    //@dev - Test getRandomNumber()
    console.log('Should successfully make an external random number request')
    const linkAmount = ethers.utils.parseEther('1')  // 1 LINK
    const txReceipt1 = await linkToken.approve(RANDOM_NUMBER_CONSUMER, linkAmount) // [Result]: Success
    
    const transaction = await randomNumberConsumer.getRandomNumber()
    //console.log(`\n transaction: ${ JSON.stringify(transaction, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const tx_receipt = await transaction.wait(1)
    //console.log(`\n tx_receipt: ${ JSON.stringify(tx_receipt, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"
    const requestId = tx_receipt.events[2].topics[1]
    //const requestId = await JSON.stringify(tx_receipt).events
    //const requestId = JSON.stringify(tx_receipt).events[2].topics[1]
    console.log("requestId: ", requestId)

    // ///@dev - Check log of callback ("requestId" that is used and "randomNumber" that is retrieved via VRF)
    // let _requestIdUsed = await randomNumberConsumer.requestIdUsed()
    // console.log('=== requestIdUsed ===', String(_requestIdUsed))

    // let _randomResult = await randomNumberConsumer.randomResult()
    // console.log('=== randomResult of getRandomNumber() via fulfillRandomness() of the VRFConsumerBase.sol ===', String(_randomResult))
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
