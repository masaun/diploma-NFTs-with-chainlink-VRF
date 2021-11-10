const { expectRevert } = require('@openzeppelin/test-helpers')

//@dev - Reference from Charm.finance
const { ethers } = require('hardhat')
const { assert, expect } = require('chai')
const { constants, Wallet } = require('ethers')
const { formatEther, parseUnits, randomBytes } = require('ethers/lib/utils')
//const { deployContract, signPermission, signPermitEIP2612 } = require('./utils')

const CHARACTER_NAME = "Shrek"

/**
 * @notice - The test of the DungeonsAndDragonsCharacter contract
 * @notice - This test file is written by web3.js almostly (ethers.js is just used for formatEther, etc...)
 */
contract('DungeonsAndDragonsCharacter', accounts => {
    //@dev - Accounts
    let defaultAccount, user1

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
    //const LINK_TOKEN = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
    let LINK_TOKEN  /// [NOTE]: LinkToken contract address that is deployed by myself will be assigned into this variable.


    before(async () => {
        //@dev - Setup accounts
        accounts = await ethers.getSigners()
        defaultAccount = accounts[0].address
        user1 = accounts[1].address
        console.log('=== defaultAccount ===', defaultAccount)

        //@dev - Deploy the LinkToken contract (solidity-v0.4) by using "web3.js" (Not using "ethers.js")
        linkToken = await LinkToken.new({ from: defaultAccount })  /// [NOTE]: Using web3.js
        LINK_TOKEN = linkToken.address

        //@dev - Deploy the DungeonsAndDragonsCharacter contract
        dadc = await DungeonsAndDragonsCharacter.new(VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, { from: defaultAccount })
        DADC = dadc.address
        console.log('=== LINK_TOKEN ===', LINK_TOKEN)
        console.log('=== DADC ===', DADC)
    })
    
    // TODO

    describe('Generate your random character (by sending a request to VRF)', () => {
        it('A character is minted as a NFT', async () => {
            const to = user1
            const tokenURI = "https://example.nft.com/image/1"
            let txReceipt = await dadc.mint(to, tokenURI)
            console.log('=== txReceipt of mint() ===', txReceipt)
        })

        it('setTokenURI()', async () => {})

        it('getTokenURI()', async () => {
            const tokenId = 1
            const tokenURI = await dadc.getTokenURI(tokenId)
            console.log('=== tokenURI (of tokenId=1) ===', tokenURI)
        })

        it('getLevel()', async () => {})

        it('getNumberOfCharacters()', async () => {})

        it('getCharacterOverView()', async () => {})

        it('getCharacterStats()', async () => {})

        it('requestNewRandomCharacter()', async () => {  /// Main method
            ///@dev - Deposit 5 LINK into the DungeonsAndDragonsCharacter contract (for payment for request)
            const to = DADC
            const depositAmount = ethers.utils.parseEther('5')  // 5 LINK 
            let txReceipt1 = await linkToken.approve(to, depositAmount)
            let txReceipt2 = await dadc.depositLinkForPaymentForRequest(depositAmount)
            console.log('=== depositLinkForPaymentForRequest() of the DungeonsAndDragonsCharacter contract ===', txReceipt2)

            ///@dev - Check LINK balance of the DungeonsAndDragonsCharacter contract
            let linkBalance = await linkToken.balanceOf(DADC)
            console.log(`LINK balance of the DungeonsAndDragonsCharacter contract: ${ ethers.utils.formatEther(String(linkBalance)) } LINK`)

            ///@dev - Send a request to Chainlink-VRF
            const name = "A Test Character"  /// [TODO]: This "name" is the value which is assigned based on the name property in the Character struct
            //const name = "DungeonsAndDragonsCharacter"
            let txReceipt3 = await dadc.requestNewRandomCharacter(name)
            // console.log('=== txReceipt of requestNewRandomCharacter() ===', txReceipt3)
        })

    })
})
