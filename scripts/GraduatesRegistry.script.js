const { ethers } = require("hardhat")


/**
 * @notice - This is a script file for the GraduatesRegistry.sol
 */ 
async function main() {

    console.log('---- This is a script file for the GraduatesRegistry.sol ---')

    //@dev - Deployed-addresses
    const DIPLOMA_NFT_FACTORY = "0x2b3C382612df6A4e2D1b460481a386956f585B0F"  // Kovan    
    const GRADUATES_REGISTRY = "0x7658f04A88B78fCCba48AB47e39921929C6a1020"   // Kovan
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
    const transaction = await graduatesRegistry.registerNewGraduate(DIPLOMA_NFT, graduate, { gasLimit: 12500000, gasPrice: 25000000000 })  // Kovan
    console.log(`\n transaction: ${ JSON.stringify(transaction, null, 2) }`)  /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"

    const tx_receipt = await transaction.wait()
    console.log(`\n tx_receipt: ${ JSON.stringify(tx_receipt, null, 2) }`)    /// [NOTE]: Using "JSON.stringify()" to avoid that value is "[object object]"
    

    ///------------------------------------------------------------------
    /// Check requestId and random number that is retrieved and stored
    ///------------------------------------------------------------------

    console.log("=== tx_receipt.events.length ===", tx_receipt.events.length)

    //@dev - ABI of the VRFCoodinator.sol
    const ABI_OF_VRF_COORDINATOR = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_link",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_blockHashStore",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "keyHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          }
        ],
        "name": "NewServiceAgreement",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "keyHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "seed",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "jobID",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "requestID",
            "type": "bytes32"
          }
        ],
        "name": "RandomnessRequest",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "requestId",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "output",
            "type": "uint256"
          }
        ],
        "name": "RandomnessRequestFulfilled",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "PRESEED_OFFSET",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "PROOF_LENGTH",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "PUBLIC_KEY_OFFSET",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "callbacks",
        "outputs": [
          {
            "internalType": "address",
            "name": "callbackContract",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "randomnessFee",
            "type": "uint96"
          },
          {
            "internalType": "bytes32",
            "name": "seedAndBlockNum",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes",
            "name": "_proof",
            "type": "bytes"
          }
        ],
        "name": "fulfillRandomnessRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256[2]",
            "name": "_publicKey",
            "type": "uint256[2]"
          }
        ],
        "name": "hashOfKey",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isOwner",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_fee",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "_data",
            "type": "bytes"
          }
        ],
        "name": "onTokenTransfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_fee",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_oracle",
            "type": "address"
          },
          {
            "internalType": "uint256[2]",
            "name": "_publicProvingKey",
            "type": "uint256[2]"
          },
          {
            "internalType": "bytes32",
            "name": "_jobID",
            "type": "bytes32"
          }
        ],
        "name": "registerProvingKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "serviceAgreements",
        "outputs": [
          {
            "internalType": "address",
            "name": "vRFOracle",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "fee",
            "type": "uint96"
          },
          {
            "internalType": "bytes32",
            "name": "jobID",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "withdrawableTokens",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]


    const VRF_COORDINATOR = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"  // Chainlink-VRF coordinator on Kovan
    for (let i=0; tx_receipt.events.length - 1; i++) {
        let addressInLog = tx_receipt.events[i].address
        if (addressInLog == VRF_COORDINATOR) {
            const _topics = tx_receipt.events[i].topics
            const _data = tx_receipt.events[i].data

            //@dev - Create an interface (iface) for getting eventLog of "RandomnessRequest" below 
            const iface = new ethers.utils.Interface(ABI_OF_VRF_COORDINATOR)

            //@dev - Retrieve an event log of "RandomnessRequest" that is defined in the VRFCoodinator.sol
            let eventLogs = iface.decodeEventLog("RandomnessRequest", _data, _topics)  // [NOTE]: Retrieve an event of "RandomnessRequest"
            console.log(`=== eventLogs of "RandomnessRequest" ===`, eventLogs)

            const requestId = eventLogs[4]
            console.log(`=== requestId ===`, requestId)
        }
    }
    // const requestId = tx_receipt.events[0].topics[1]
    // console.log("=== requestId ===", requestId)


    ///@dev - Check log of callback ("requestId" that is used and "randomNumber" that is retrieved via VRF)
    const diplomaNFT = await ethers.getContractAt("DiplomaNFT", DIPLOMA_NFT)
    let _requestIdUsed = await diplomaNFT.requestIdUsed()
    console.log('=== requestIdUsed ===', String(_requestIdUsed))

    let _randomResult = await diplomaNFT.randomNumberStored(_requestIdUsed)
    console.log('=== randomNumberStored of DiplomaNFT that is retrieved via getRandomNumber() that the VRFConsumerBase.sol is used ===', String(_randomResult))


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
