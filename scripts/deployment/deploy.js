const { ethers } = require("hardhat")


async function main() {
    /**
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     * Fee: 0.1 LINK
     */
    const _vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    const _link = "0xa36085F69e2889c224210F603D836748e7dC0088"  // LINK token address on Kovan
    const _keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    const _fee = ethers.utils.parseEther('0.1')  // 0.1 LINK

    const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    const randomNumberConsumer = await RandomNumberConsumer.deploy(_vrfCoordinator, _link, _keyHash, _fee)

    console.log("RandomNumberConsumer deployed to:", randomNumberConsumer.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })