const { expectRevert } = require('@openzeppelin/test-helpers')

//@dev - Reference from Charm.finance
const { ethers } = require('hardhat')
const { assert, expect } = require('chai')
const { constants, Wallet } = require('ethers')
const { formatEther, parseUnits, randomBytes } = require('ethers/lib/utils')
//const { deployContract, signPermission, signPermitEIP2612 } = require('./utils')

const CHARACTER_NAME = "Shrek"


contract('DungeonsAndDragonsCharacter', accounts => {
    //@dev - Accounts
    let defaultAccount

    //@dev - Artifacts
    const LinkToken  = artifacts.require('LinkToken')  /// [Result]: Success to read artifact of "LinkToken"!!
    const DungeonsAndDragonsCharacter = artifacts.require('DungeonsAndDragonsCharacter.sol')

    //@dev - Contract instances
    let linkToken, dadc

    //@dev - Contract addresses
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
        //@dev - Setup accounts
        accounts = await ethers.getSigners()
        defaultAccount = accounts[0].address
        console.log('=== defaultAccount ===', defaultAccount)

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
        it('A character is minted as a NFT', async () => {
            //let txReceipt = await dadc.mint()
        })

        it('setTokenURI()', async () => {})

        it('getTokenURI()', async () => {})

        it('getLevel()', async () => {})

        it('getNumberOfCharacters()', async () => {})

        it('getCharacterOverView()', async () => {})

        it('getCharacterStats()', async () => {})

        it('requestNewRandomCharacter()', async () => {})  /// Main method

    })
})
