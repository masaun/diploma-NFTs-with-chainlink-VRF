
async function main() {
    /**
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     * Fee: 0.1 LINK
     */
    const _vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    const _link = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"  // LINK token address on Rinkeby
    const _keyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    const _fee = 1

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