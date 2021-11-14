const { ethers } = require("hardhat")


async function main() {
    // [NOTE]: Deployed-address of the RandomNumberConsumer.sol on Rinkeby is "0x461f9bD7A33B9532a19BC7B7834063c313058e32"

    //@dev - Get the contract to deploy
    const RANDOM_NUMBER_CONSUMER = "0x461f9bD7A33B9532a19BC7B7834063c313058e32"
    //const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    //const randomNumberConsumer = await RandomNumberConsumer.deploy()
    const randomNumberConsumer = await ethers.getContractAt("RandomNumberConsumer", RANDOM_NUMBER_CONSUMER)
    console.log("Deployed-address of the RandomNumberConsumer.sol on Rinkeby", randomNumberConsumer.address)  // [Result]: "0x461f9bD7A33B9532a19BC7B7834063c313058e32"

    //@dev - Test getRandomNumber()
    console.log('Should successfully make an external random number request')
    const transaction = await randomNumberConsumer.getRandomNumber()
    console.log(`transaction: ${ JSON.stringify(transaction) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const tx_receipt = await transaction.wait(1)
    console.log(`tx_receipt: ${ JSON.stringify(tx_receipt) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"
    //const requestId = tx_receipt.events[2].topics[1]

    // console.log("requestId: ", requestId)
    // expect(requestId).to.not.be.null

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
