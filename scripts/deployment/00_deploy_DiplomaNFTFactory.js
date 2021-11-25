const { ethers } = require("hardhat")


/**
 * @dev - This is a deployment file for the DiplomaNFTFactory.sol
 * Network: Kovan or Polygon-Mumbai
 */
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
     * 
     * Network: Polygon-Mumbai
     * Chainlink VRF Coordinator address:  0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
     * LINK token address:  0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Key Hash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
     * Fee: 0.0001 LINK
     */

    // [NOTE]: Kovan
    const _vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    const _link = "0xa36085F69e2889c224210F603D836748e7dC0088"  // LINK token address on Kovan
    const _keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    const _fee = ethers.utils.parseEther('0.1')  // 0.1 LINK

    ///@dev - RandomNumberConsumer.sol
    // const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    // const randomNumberConsumer = await RandomNumberConsumer.deploy(_vrfCoordinator, _link, _keyHash, _fee)
    // console.log("RandomNumberConsumer deployed to:", randomNumberConsumer.address)

    ///@dev - DiplomaNFTFactory.sol
    const DiplomaNFTFactory = await ethers.getContractFactory("DiplomaNFTFactory")
    const diplomaNFTFactory = await DiplomaNFTFactory.deploy(_vrfCoordinator, _link, _keyHash, _fee)
    console.log("DiplomaNFTFactory deployed to:", diplomaNFTFactory.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })