const RandomNumberConsumer = artifacts.require('RandomNumberConsumer')

module.exports = async (deployer, network, [defaultAccount]) => {
    // Local (development) networks need their own deployment of the LINK
    // token and the Oracle contract
    if (!network.startsWith('rinkeby')) {
        console.log("We can deploy stuff... but that's it!")
    }
    const randomNumberConsumer = await RandomNumberConsumer.deployed()
    //console.log(await randomNumberConsumer.weather())
}
