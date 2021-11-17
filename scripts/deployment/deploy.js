const { ethers } = require("hardhat")


async function main() {
    /**
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     * Fee: 0.1 LINK
     * 
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     * Fee: 0.1 LINK
     */

    // [NOTE]: Kovan
    const _vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    const _link = "0xa36085F69e2889c224210F603D836748e7dC0088"  // LINK token address on Kovan
    const _keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    const _fee = ethers.utils.parseEther('0.1')  // 0.1 LINK

    // [NOTE]: Rinkeby
    //const _vrfCoordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    //const _link = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"  // LINK token address on Rinkeby
    //const _keyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    //const _fee = ethers.utils.parseEther('0.1')  // 0.1 LINK

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