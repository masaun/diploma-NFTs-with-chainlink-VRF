const { ethers } = require("hardhat")

const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"  // Deployed-address of $LINK token on Kovan

/**
 * @dev - This is a deployment file for the GraduatesRegistry.sol
 * Network: Kovan or Polygon-Mumbai
 */
async function main() {
    const GraduatesRegistry = await ethers.getContractFactory("GraduatesRegistry")
    const graduatesRegistry = await GraduatesRegistry.deploy(LINK_TOKEN)
    console.log("GraduatesRegistry.sol deployed to:", graduatesRegistry.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })