const { expect } = require("chai");
const { ethers } = require("hardhat");

const RANDOM_NUMBER_CONSUMER = "0x4bE1A94185dDa864906D098B35595Bb35272EB04"


describe("RandomNumberConsumer", function () {
  it("Should be successful to execute randomNumberConsumer.getRandomNumber()", async function () {

    //const randomNumberConsumer = await ethers.getContractAt('RandomNumberConsumer',RANDOM_NUMBER_CONSUMER)

    const _vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    const _link = "0xa36085F69e2889c224210F603D836748e7dC0088"  // LINK token address on Kovan
    const _keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    const _fee = ethers.utils.parseEther('0.1')  // 0.1 LINK

    const RandomNumberConsumer = await ethers.getContractFactory("RandomNumberConsumer")
    const randomNumberConsumer = await RandomNumberConsumer.deploy(_vrfCoordinator, _link, _keyHash, _fee)
    await randomNumberConsumer.deployed()

    console.log("RandomNumberConsumer deployed to:", randomNumberConsumer.address)

    const tx = await randomNumberConsumer.getRandomNumber()

    // wait until the transaction is mined
    const result = await tx.wait()
    console.log('\n result: ', result)

  })
})
