\# Advanced Web3 Digital Asset Marketplace



\## Overview



This project is a full-stack decentralized application (DApp) that enables users to buy, sell, and transfer ownership of digital assets using ERC20 tokens as a payment method.



The application is built using Solidity for smart contract development, Hardhat for testing and deployment, and React for the frontend interface.



The goal of this project is to demonstrate a complete Web3 architecture, including secure smart contract design, blockchain interaction, and a responsive user interface.



\---



\## Key Features



\- Purchase digital assets using ERC20 tokens

\- Sell and list digital assets on-chain

\- Transfer ownership between users

\- Real-time transaction feedback in the UI

\- Secure transaction handling with smart contract validation



\---



\## Architecture



The project follows a modular full-stack architecture:



\- Smart Contracts (Solidity)

&#x20; - DigitalArtMarket.sol

&#x20; - MockToken.sol (ERC20 for payments)



\- Backend / Blockchain Layer

&#x20; - Hardhat for deployment and testing

&#x20; - Ethers.js for contract interaction



\- Frontend (React + Vite)

&#x20; - Wallet connection

&#x20; - Transaction execution

&#x20; - UI state management



\---



\## Smart Contract Design



The DigitalArtMarket contract handles:



\- Asset creation and registration

\- Listing assets for sale

\- Purchasing assets using ERC20 tokens

\- Ownership transfer

\- Transaction logging



Security considerations include:



\- Input validation for all transactions

\- Controlled access for critical functions

\- Safe ERC20 token transfers

\- Protection against invalid ownership transfers



\---



\## Testing



Smart contract functionality is tested using Hardhat:



\- Deployment tests

\- Purchase and sale logic

\- Ownership transfer validation

\- Token interaction tests



\---



\## Installation



Clone the repository:



&#x20;   git clone https://github.com/minadoryani/advanced-digital-asset-marketplace



Install dependencies:



&#x20;   npm install



\---



\## Run Smart Contracts



&#x20;   npx hardhat compile

&#x20;   npx hardhat test

&#x20;   npx hardhat node

&#x20;   npx hardhat run scripts/deploy.js --network localhost



\---



\## Run Frontend



&#x20;   cd frontend

&#x20;   npm install

&#x20;   npm run dev



\---



\## Environment Variables



Create a `.env` file:



&#x20;   SEPOLIA\_RPC\_URL=your\_rpc\_url

&#x20;   PRIVATE\_KEY=your\_private\_key



\---



\## Purpose



This project demonstrates practical experience in:



\- Smart contract development

\- Full-stack Web3 application architecture

\- Secure blockchain interactions

\- Frontend and smart contract integration



\---



\## Author



Mina Doryani

