# Diploma-NFTs with Chainlink-VRF
## 【Overview】
- This is a smart contract that give graduates a diploma of schools (such as college, university, etc) which is published as a `NFT` with a `random number (randomness)` generated by `Chainlink-VRF (Verifiable Random Function) ` 

<br>

- By using that, 
  - Schools (such as college, university, etc) can give graduates truly unique diploma.
  - Graduates can utilize their diploma as a proof for various opportunities. 

<br>

## 【Setup (Installation)】
- ① Add `.env` file to the root directory. 
  (Please `.env.example` for creating `.env` file)

<br>

- ② Install modules 
```
yarn
```

<br>

## 【Deployment】
- Deploy 3 smart contracts on Kovan testnet
```
yarn script-kovan:Deploy
```

<br>

## 【Script】
- Execute the script that includes the whole scenario of this smart contracts.
```
yarn script-kovan:GraduatesRegistry
```

<br>

## 【References】
- Chainlink VRF:
  - Document: https://docs.chain.link/docs/chainlink-vrf/

<br>

- Example Repo: 
  - Chainlink Hardhat Box (hardhat-starter-kit): https://github.com/smartcontractkit/hardhat-starter-kit

<br>

- Articles:
  - How to Build Dynamic NFTs on Polygon: https://blog.chain.link/how-to-build-dynamic-nfts-on-polygon/
