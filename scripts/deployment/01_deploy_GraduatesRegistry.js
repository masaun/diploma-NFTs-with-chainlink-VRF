const { ethers } = require("hardhat")


/**
 * @dev - This is a deployment file for the GraduatesRegistry.sol
 * Network: Kovan or Polygon-Mumbai
 */
async function main() {
    const GraduatesRegistry = await ethers.getContractFactory("GraduatesRegistry")
    const graduatesRegistry = await GraduatesRegistry.deploy()
    console.log("GraduatesRegistry.sol deployed to:", graduatesRegistry.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })