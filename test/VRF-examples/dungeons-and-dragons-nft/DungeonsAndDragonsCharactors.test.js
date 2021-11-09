const { expectRevert } = require('@openzeppelin/test-helpers')

//@dev - Reference from Charm.finance
const { ethers } = require('hardhat')
const { assert, expect } = require('chai')
const { constants, Wallet } = require('ethers')
const { formatEther, parseUnits, randomBytes } = require('ethers/lib/utils')
//const { deployContract, signPermission, signPermitEIP2612 } = require('./utils')

const CHARACTER_NAME = "Shrek"


contract('DungeonsAndDragonsCharacter', accounts => {
    const LinkToken  = artifacts.require('LinkToken')  /// [Result]: Success to read artifact of "LinkToken"!!
    //const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')

    //const LinkTokenInterface = artifacts.require('@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol:LinkTokenInterface')  /// [Result]: Success to read artifact of "LinkToken"!!

    const DungeonsAndDragonsCharacter = artifacts.require('DungeonsAndDragonsCharacter.sol')
    const defaultAccount = accounts[0]

    let linkToken, dadc
    let DADC

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     */
    const VRF_COORDINATOR = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    const KEY_HASH = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    const LINK_TOKEN = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"


    before(async () => {
        linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)
        //linkToken = await LinkToken.new({ from: defaultAccount })
        dadc = await DungeonsAndDragonsCharacter.new(VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, { from: defaultAccount })

        //LINK_TOKEN = linkToken.address
        DADC = dadc.address
        console.log('=== LINK_TOKEN ===', LINK_TOKEN)
        console.log('=== DADC ===', DADC)
    })
    
    // TODO

    describe('Generate your random character (by sending a request to VRF)', () => {
        it('Some action 1', async () => {
        })

        it('Some action 2', async () => {
        })
    })

})
