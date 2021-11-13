const { ethers } = require("hardhat")


async function main() {
    // [NOTE]: Deployed-address of the RandomNumberConsumer.sol on Rinkeby is "0x461f9bD7A33B9532a19BC7B7834063c313058e32"

    //@dev - Get the contract to deploy
    const RANDOM_NUMBER_CONSUMER = "0x461f9bD7A33B9532a19BC7B7834063c313058e32"
    //const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    //const randomNumberConsumer = await RandomNumberConsumer.deploy()
    const randomNumberConsumer = await ethers.getContractAt("RandomNumberConsumer", RANDOM_NUMBER_CONSUMER)
    console.log("Deployed-address of the RandomNumberConsumer.sol on Rinkeby", randomNumberConsumer.address)  // [Result]: "0x461f9bD7A33B9532a19BC7B7834063c313058e32"
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
