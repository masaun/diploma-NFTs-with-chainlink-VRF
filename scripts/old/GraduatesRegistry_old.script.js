const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Deployed-addresses
    const DIPLOMA_NFT_FACTORY = "0x6688Bcf5F991Eec26F5AF0e99Cf26FC71568996B"  // Kovan    
    const GRADUATES_REGISTRY = "0x0FF1001D1f78b9abdb23c7b37E5a99087E12Ec09"   // Kovan
    //const GRADUATES_REGISTRY = "0xc4d5A87471185eB469bd86c8758061393E22a31d" // Polygon-Mumbai
    
    const diplomaNFTFactory = await ethers.getContractAt("DiplomaNFTFactory", DIPLOMA_NFT_FACTORY)
    const graduatesRegistry = await ethers.getContractAt("GraduatesRegistry", GRADUATES_REGISTRY)
    console.log("Deployed-address of the DiplomaNFTFactory.sol on Kovan: ", diplomaNFTFactory.address) 
    console.log("Deployed-address of the GraduatesRegistry.sol on Kovan: ", graduatesRegistry.address) 


    //@dev - Create a new DiplomaNFT
    const _diplomaNFTName = "Diploma of the East University"
    const _diplomaNFTSymbol = "DIPLOMA_OF_EAST_UNIVERSITY" 
    let txReceipt = await diplomaNFTFactory.createNewDiplomaNFT(_diplomaNFTName, _diplomaNFTSymbol)

    //@dev - Using getDiplomaNFTAddressCreatedTheLatest() instead of using eventLog of "DiplomaNFTCreated" in order to retrieve a DiplomaNFT's address
    let DIPLOMA_NFT = await diplomaNFTFactory.getDiplomaNFTAddressCreatedTheLatest()
    console.log(`=== DIPLOMA_NFT ===`, DIPLOMA_NFT)

    //@dev - Register a new graduate
    //@dev - Gas Fee the best to call getRandomNumber method: gasLimit (12500000 wei) * gasPrice (10000000000 wei = 10 Gwei) = 0.001 ETH 
    console.log('registerNewGraduate() - Should successfully execute registerNewGraduate()')

    //@dev - Approve spending $LINK Token for the GraduatesRegistry.sol
    const LINK_TOKEN = "0xa36085F69e2889c224210F603D836748e7dC0088"  // Kovan
    const linkToken = await ethers.getContractAt('@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol:LinkTokenInterface', LINK_TOKEN)
    const linkAmount = ethers.utils.parseEther('1')      // 1 LINK
    //const linkAmount = ethers.utils.parseEther('0.1')  // 0.1 LINK
    const txReceipt2 = await linkToken.approve(GRADUATES_REGISTRY, linkAmount)
    console.log(`\n txReceipt that linkToken.approve() for the GraduatesRegistry.sol: ${ JSON.stringify(txReceipt2, null, 2) }`)
    const tx_receipt_2 = await txReceipt2.wait()  /// [NOTE]: Next step must wait until linkToken.approve() is finished

    const graduate = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1" /// [NOTE]: This is an example of wallet address of a new graduate.  
    const transaction = await graduatesRegistry.registerNewGraduate(DIPLOMA_NFT, graduate, { gasLimit: 12500000, gasPrice: 20000000000 })  // Kovan
    console.log(`\n transaction: ${ JSON.stringify(transaction, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const tx_receipt = await transaction.wait()
    console.log(`\n tx_receipt: ${ JSON.stringify(tx_receipt, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"


    ///------------------------------------------------------------------
    /// Check requestId and random number that is retrieved and stored
    ///------------------------------------------------------------------

    //@dev - Check log of callback ("requestId" that is used and "randomNumber" that is retrieved via VRF)
    const diplomaNFT = await ethers.getContractAt("DiplomaNFT", DIPLOMA_NFT)

    //@dev - ABI of the VRFCoodinator.sol
    const ABI_OF_VRF_COORDINATOR = require("@chainlink/contracts/abi/v0.6/VRFCoordinator.json") 

    //@dev - Deployed-address of the VRFCoordinator.sol on Kovan 
    const VRF_COORDINATOR = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"  // Chainlink-VRF coordinator on Kovan

    console.log("=== tx_receipt.events.length ===", tx_receipt.events.length)
    const indexOfEvent = 6 // Index number of event of "RandomnessRequest" (that can identify the result on Etherscan)
    let addressInLog = tx_receipt.events[indexOfEvent].address
    if (addressInLog == VRF_COORDINATOR) {
        const _topics = tx_receipt.events[indexOfEvent].topics
        const _data = tx_receipt.events[indexOfEvent].data

        //@dev - Create an interface (iface) for getting eventLog of "RandomnessRequest" below 
        const iface = new ethers.utils.Interface(ABI_OF_VRF_COORDINATOR)

        //@dev - Retrieve an event log of "RandomnessRequest" that is defined in the VRFCoodinator.sol
        let eventLogs = iface.decodeEventLog("RandomnessRequest", _data, _topics)  // [NOTE]: Retrieve an event of "RandomnessRequest"
        console.log(`=== eventLogs of "RandomnessRequest" ===`, eventLogs)

        //@dev - Retrieve a requestId used via an event log of "RandomnessRequest"
        const requestId = eventLogs.requestID
        console.log(`=== requestId ===`, requestId)

        //@dev - Wait 10 seconds
        await new Promise(resolve => setTimeout(resolve, 10000))    // 10 seconds

        //@dev - GET a random number that is stored in "randomResult"
        let _randomResult2 = await diplomaNFT.randomResult()
        console.log('=== randomResult ===', String(_randomResult2))

        //@dev - Retrieve a random number by using requestId used via an event log of "RandomnessRequest"
        let _randomResult = await diplomaNFT.randomNumberStored(requestId)
        console.log('=== randomNumberStored 1 ===', String(_randomResult))

        //@dev - Execute getRandomNumberStored()
        let _randomNumberStored = await diplomaNFT.getRandomNumberStored(String(requestId))
        console.log('=== randomNumberStored 2 ===', String(_randomNumberStored))

        //@dev - Test an alternative way to retrieve the result of request of random nuber
        let _randomResultByAlternativeWay = await diplomaNFT.getRandomNumberStoredTheLatest()
        console.log('=== randomResultByAlternativeWay ===', String(_randomResultByAlternativeWay))
    }

    // for (let i=0; tx_receipt.events.length - 1; i++) {
    //     let addressInLog = tx_receipt.events[i].address
    //     if (addressInLog == VRF_COORDINATOR) {
    //         const _topics = tx_receipt.events[i].topics
    //         const _data = tx_receipt.events[i].data

    //         //@dev - Create an interface (iface) for getting eventLog of "RandomnessRequest" below 
    //         const iface = new ethers.utils.Interface(ABI_OF_VRF_COORDINATOR)

    //         //@dev - Retrieve an event log of "RandomnessRequest" that is defined in the VRFCoodinator.sol
    //         let eventLogs = iface.decodeEventLog("RandomnessRequest", _data, _topics)  // [NOTE]: Retrieve an event of "RandomnessRequest"
    //         console.log(`=== eventLogs of "RandomnessRequest" ===`, eventLogs)

    //         //@dev - Retrieve a requestId used via an event log of "RandomnessRequest"
    //         const requestId = eventLogs.requestID
    //         console.log(`=== requestId ===`, requestId)

    //         //@dev - Wait 10 seconds
    //         await new Promise(resolve => setTimeout(resolve, 10000))    // 10 seconds

    //         //@dev - GET a random number that is stored in "randomResult"
    //         let _randomResult2 = await diplomaNFT.randomResult()
    //         console.log('=== randomResult ===', String(_randomResult2))

    //         //@dev - Retrieve a random number by using requestId used via an event log of "RandomnessRequest"
    //         let _randomResult = await diplomaNFT.randomNumberStored(requestId)
    //         console.log('=== randomNumberStored 1 ===', String(_randomResult))

    //         //@dev - Execute getRandomNumberStored()
    //         let _randomNumberStored = await diplomaNFT.getRandomNumberStored(String(requestId))
    //         console.log('=== randomNumberStored 2 ===', String(_randomNumberStored))

    //         //@dev - Test an alternative way to retrieve the result of request of random nuber
    //         let _randomResultByAlternativeWay = await diplomaNFT.getRandomNumberStoredTheLatest()
    //         console.log('=== randomResultByAlternativeWay ===', String(_randomResultByAlternativeWay))
    //     }
    // }


    ///--------------------------------------------------------------------------------
    /// Check requestId and random number that is retrieved and stored - via EventLogs 
    ///--------------------------------------------------------------------------------


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
