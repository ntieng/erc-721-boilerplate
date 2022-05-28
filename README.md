# Base Project

This is a base project for blockchain. 

## Installation and Setup

```bash
1. create new .env file
2. copy the content of .env.example file and paste it to .env file
3. replace the keys accordingly
4. npm install
```

## Usage (Hardhat)
Refer to [Hardhat doc](https://hardhat.org/getting-started/#:~:text=%23-,Running%20tasks,-To%20first%20get)
```bash
# Compile Contracts
npx hardhat compile

# Deploy Contract
npx hardhat --network YOUR_NETWORK run scripts/deploy.ts

# Run Test
npx hardhat test

# Flatten
npx hardhat flatten contracts/YourContract.sol > FlattenContract.sol

# Verify
npx hardhat verify --network YOUR_NETWORK YOUR_CONTRACT_ADDRESS
```

## UI
```bash
# Replace contractAddress and contractAbi name in index.js

# Copy and paste generated json file from artifacts/contracts into frontend folder

# Right click index.html and select Open with Live Server
```
