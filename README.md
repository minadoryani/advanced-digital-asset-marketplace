# Advanced Digital Asset Marketplace

## Introduction

Advanced Digital Asset Marketplace is a full-stack Web3 application that enables users to buy, sell, and transfer digital assets through blockchain-based ownership logic and ERC20 token payments.

The project combines Solidity smart contracts, Hardhat-based development and testing, and a React frontend to simulate a practical marketplace workflow for tokenized digital assets.

It is designed to demonstrate end-to-end Web3 development, including contract architecture, secure transaction handling, frontend integration, and user-facing blockchain interaction.

## Core Functionality

The application supports the following marketplace operations:

- registration of digital assets
- listing assets for sale
- purchasing assets with ERC20 tokens
- transferring asset ownership between users
- displaying transaction feedback through the frontend

The payment layer is handled through a mock ERC20 token contract, allowing the marketplace contract to process token-based transactions in a controlled testing environment.

## Technical Architecture

The project is structured into three main layers.

### Smart Contract Layer

The smart contract layer is implemented in Solidity and includes:

- `DigitalArtMarket.sol` for marketplace logic
- `MockToken.sol` for ERC20-based payment simulation

This layer is responsible for asset registration, listing, purchase flow, ownership transfer, and transaction validation.

### Development and Testing Layer

Hardhat is used as the local blockchain development environment for:

- compilation
- deployment
- automated testing
- contract interaction during development

The test suite validates core marketplace behavior, including purchase logic, asset transfers, and token interactions.

### Frontend Layer

The frontend is built with React and Vite and provides the user interface for interacting with the marketplace.

It is responsible for:

- connecting user actions to smart contract calls
- displaying marketplace state
- handling transaction feedback
- presenting asset and ownership information in a usable format

## Security and Validation Considerations

The project was built with attention to practical smart contract design principles, including:

- validation of transaction inputs
- controlled execution of ownership transfers
- ERC20-based payment verification
- separation of contract logic and frontend interaction
- test coverage for critical marketplace flows

While the application is designed as a portfolio and learning project, it reflects production-relevant patterns in Web3 architecture and contract interaction.

## Project Structure

    advanced-digital-asset-marketplace/
    ├── contracts/
    │   ├── DigitalArtMarket.sol
    │   └── MockToken.sol
    ├── scripts/
    │   └── deploy.js
    ├── test/
    │   └── DigitalArtMarket.js
    ├── frontend/
    │   ├── src/
    │   ├── package.json
    │   └── vite.config.js
    ├── hardhat.config.js
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

## Local Setup

Install dependencies in the root project:

    npm install

Run compilation:

    npx hardhat compile

Run tests:

    npx hardhat test

Start a local blockchain:

    npx hardhat node

Deploy contracts locally:

    npx hardhat run scripts/deploy.js --network localhost

Start the frontend:

    cd frontend
    npm install
    npm run dev

## Environment Configuration

Create a `.env` file in the project root and configure the required variables:

    SEPOLIA_RPC_URL=your_rpc_url
    PRIVATE_KEY=your_private_key

## What This Project Demonstrates

This project is intended to demonstrate practical skills in:

- Solidity smart contract development
- Hardhat-based deployment and testing workflows
- ERC20 token integration
- full-stack Web3 application architecture
- frontend-to-contract interaction
- blockchain-based marketplace design

## Author

Mina Doryani
