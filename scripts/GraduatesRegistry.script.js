const { ethers } = require("hardhat")
require('dotenv').config()


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 * @notice - This script is that getRandomNumber() and mintDiplomaNFT() are executed separately.
 */ 
async function main() {

    console.log('----- The scenario of granting a DiplomaNFT start -----')

    ///-------------------------------------------------------
    /// Setup
    ///-------------------------------------------------------
    console.log('\n----- Setup -----')

    ///@dev - Setup test accounts of graduates
    const graduate1 = process.env.TEST_ACCOUNT_1
    const graduate2 = process.env.TEST_ACCOUNT_2
    const graduate3 = process.env.TEST_ACCOUNT_3

    ///@dev - Deployed-addresses
    const DIPLOMA_NFT_FACTORY = "0xE1538ee65808dC992c22fd656C4CFf08350BBb9F"  // Kovan
    const GRADUATES_REGISTRY = "0xAcEa79FC1cF702C6A7F39823905d988E69784AD3"   // Kovan
    //const GRADUATES_REGISTRY = "0xc4d5A87471185eB469bd86c8758061393E22a31d" // Polygon-Mumbai
    
    const diplomaNFTFactory = await ethers.getContractAt("DiplomaNFTFactory", DIPLOMA_NFT_FACTORY)
    const graduatesRegistry = await ethers.getContractAt("GraduatesRegistry", GRADUATES_REGISTRY)
    console.log("Deployed-address of the DiplomaNFTFactory.sol on Kovan: ", diplomaNFTFactory.address) 
    console.log("Deployed-address of the GraduatesRegistry.sol on Kovan: ", graduatesRegistry.address) 

    ///@dev - ABI of the VRFCoodinator.sol
    const ABI_OF_VRF_COORDINATOR = require("@chainlink/contracts/abi/v0.6/VRFCoordinator.json") 

    ///@dev - Deployed-address of the VRFCoordinator.sol on Kovan 
    const VRF_COORDINATOR = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"  // Chainlink-VRF coordinator on Kovan


    ///-------------------------------------------------------
    /// Create a new DiplomaNFT
    ///-------------------------------------------------------
    console.log('\n------- Grant a DiplomaNFT (with a random number generated) for 1st graduate -------')
    console.log('\n----- Create a new DiplomaNFT -----')

    const _diplomaNFTName = "Diploma of the East University"
    const _diplomaNFTSymbol = "DIPLOMA_OF_EAST_UNIVERSITY" 
    let txReceipt = await diplomaNFTFactory.createNewDiplomaNFT(_diplomaNFTName, _diplomaNFTSymbol)

    //@dev - Using getDiplomaNFTAddressCreatedTheLatest() instead of using eventLog of "DiplomaNFTCreated" in order to retrieve a DiplomaNFT's address
    let DIPLOMA_NFT = await diplomaNFTFactory.getDiplomaNFTAddressCreatedTheLatest()
    console.log(`\n=== A new DiplomaNFT address created ===`, DIPLOMA_NFT)

    //@dev - Create a DiplomaNFT instance
    const diplomaNFT = await ethers.getContractAt("DiplomaNFT", DIPLOMA_NFT)
    const DIPLOMA_NFT_NAME = await diplomaNFT.name()
    const DIPLOMA_NFT_SYMBOL = await diplomaNFT.symbol()
    console.log(`\nThe name of this DiplomaNFT: ${ DIPLOMA_NFT_NAME }`)
    console.log(`The symbol of this DiplomaNFT: ${ DIPLOMA_NFT_SYMBOL } \n`)


    ///-----------------------------------------------------------------------------------------
    /// Send a request for getting a random number to Chainlink-VRF by using getRandomNumber()
    ///-----------------------------------------------------------------------------------------
    console.log('\n----- Send a request for getting a random number to Chainlink-VRF -----')

    const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"  // Kovan
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)
    //const linkAmount = ethers.utils.parseEther('1')      // 1 LINK
    const linkAmount = ethers.utils.parseEther('0.1')  // 0.1 LINK

    ///@dev - Get a random number
    let tx_1 = await linkToken.approve(DIPLOMA_NFT, linkAmount) // 1 LINK as a fee to request a randomNumber via VRF
    const txReceipt1 = await tx_1.wait()  /// [NOTE]: Next step must wait until linkToken.approve() is finished

    let tx_2 = await diplomaNFT.getRandomNumber({ gasLimit: 2500000, gasPrice: 250000000000 })
    const txReceipt_2 = await tx_2.wait()
    console.log(`\n txReceipt of getRandomNumber() execution: ${ JSON.stringify(txReceipt_2, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    ///@dev - Get a request ID used when sending to VRF
    console.log("\n=== txReceipt_2.events.length ===", txReceipt_2.events.length)
    const indexOfEvent = 3 // Index number of event of "RandomnessRequest" (that can identify the result on Etherscan)
    let addressInLog = txReceipt_2.events[indexOfEvent].address
    if (addressInLog == VRF_COORDINATOR) {
        const _topics = txReceipt_2.events[indexOfEvent].topics
        const _data = txReceipt_2.events[indexOfEvent].data

        //@dev - Create an interface (iface) for getting eventLog of "RandomnessRequest" below 
        const iface = new ethers.utils.Interface(ABI_OF_VRF_COORDINATOR)

        //@dev - Retrieve an event log of "RandomnessRequest" that is defined in the VRFCoodinator.sol
        let eventLogs = iface.decodeEventLog("RandomnessRequest", _data, _topics)  // [NOTE]: Retrieve an event of "RandomnessRequest"
        console.log(`=== eventLogs of "RandomnessRequest" ===`, eventLogs)

        //@dev - Retrieve a requestId used via an event log of "RandomnessRequest"
        const requestId = eventLogs.requestID
        console.log(`\n=== requestId that was used when sending to VRF ===`, requestId)
    }


    ///-----------------------------------------------------------------------------------------
    /// Retrieve a requestId and random number that are called back from Chainlink-VRF
    ///-----------------------------------------------------------------------------------------
    console.log('\n----- Retrieve a requestId and random number that are called back from Chainlink-VRF -----')

    ///@dev - Wait 90 seconds for calling a result of requesting a random number retrieved.
    await new Promise(resolve => setTimeout(resolve, 90000))  // Waiting for 90 seconds (90000 mili-seconds)

    ///@dev - Check log of callback ("requestId" that is used and "randomNumber" that is retrieved via VRF)
    let _requestIdCalledBack = await diplomaNFT.requestIdCalledBack()
    console.log('=== requestIdCalledBack ===', _requestIdCalledBack)

    //@dev - Retrieve a random number by assigning a requestId called back
    let _randomNumberStored = await diplomaNFT.randomNumberStored(_requestIdCalledBack)
    console.log('=== randomNumberStored ===', String(_randomNumberStored))  // [NOTE]: Need to convert from hex to string


    ///------------------------------------------------------------------------------------------------------------
    /// Register a new graduate with requestId and random number that are retrieved and stored via Chainlink-VRF
    ///------------------------------------------------------------------------------------------------------------
    console.log('\n----- Register a new graduate with requestId and random number that are retrieved and stored via Chainlink-VRF -----')

    //@dev - Gas Fee the best to call getRandomNumber method: gasLimit (12500000 wei) * gasPrice (10000000000 wei = 10 Gwei) = 0.001 ETH 
    const tx_3 = await linkToken.approve(GRADUATES_REGISTRY, linkAmount)
    const txReceipt_3 = await tx_3.wait()  /// [NOTE]: Next step must wait until linkToken.approve() is finished
    console.log(`\ntxReceipt that linkToken.approve() for the GraduatesRegistry.sol: ${ JSON.stringify(txReceipt_3, null, 2) }`)

    const newGraduateId = _requestIdCalledBack
    const randomNumberOfNewGraduate = String(_randomNumberStored)
    const newGraduateName = "Bob Jones"
    const newGraduateAddress = graduate1 /// [NOTE]: This is an example wallet address of a new graduate. 
    const tx_4 = await graduatesRegistry.registerNewGraduate(DIPLOMA_NFT, 
                                                                    newGraduateId,
                                                                    randomNumberOfNewGraduate,
                                                                    newGraduateName, 
                                                                    newGraduateAddress, 
                                                                    { gasLimit: 12500000, gasPrice: 25000000000 })  // Kovan
    console.log(`\n transaction of registerNewGraduate() execution: ${ JSON.stringify(tx_4, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const txReceipt_4 = await tx_4.wait()
    console.log(`\n txReceipt of registerNewGraduate() execution: ${ JSON.stringify(txReceipt_4, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"


    ///------------------------------------------------------------------------------------------------------------
    /// Check whether a new graduate is registered properly or not
    ///------------------------------------------------------------------------------------------------------------
    console.log('\n----- Check whether a new graduate is registered properly or not -----')

    const graduateId = newGraduateId
    let graduate = await graduatesRegistry.getGraduate(graduateId)
    console.log(`\n graduate: ${ JSON.stringify(graduate, null, 2) } \n`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    //let graduateId = graduate[0]
    let randomNumberOfGraduate = String(graduate[1])
    let diplomaNFTTokenId = String(graduate[2])
    let graduateName = graduate[3]
    let graduateAddress = graduate[4]
    console.log(`graduateId: ${ graduateId }`)
    console.log(`randomNumberOfGraduate: ${ randomNumberOfGraduate }`)
    console.log(`diplomaNFTTokenId: ${ diplomaNFTTokenId }`)
    console.log(`graduateName: ${ graduateName }`)
    console.log(`graduateAddress: ${ graduateAddress }`)



    ///------------------------------------------------------------------------------------------------------------
    /// Grant a DiplomaNFT for 2nd graduates
    ///------------------------------------------------------------------------------------------------------------
    console.log('\n------- Grant a DiplomaNFT (with a random number generated) for 2nd graduates -------')



}


/**
 * @dev - Execute scripts
 */ 
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
