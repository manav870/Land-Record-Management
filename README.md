# Land Record Management System

A blockchain-based land record management system built on Ethereum using Solidity smart contracts and React frontend.

## Project Overview

This project implements a decentralized land record management system that:
- Registers land parcels on the blockchain
- Tracks ownership transfers
- Maintains immutable ownership history
- Provides transparent and secure land records

## Technology Stack

- **Blockchain:** Ethereum (Polygon Mumbai Testnet)
- **Smart Contracts:** Solidity 0.8.x
- **Development Framework:** Hardhat
- **Frontend:** React.js with Ethers.js
- **Styling:** Tailwind CSS
- **Wallet:** MetaMask

## Project Structure

```
Land Record Management/
├── contracts/          # Smart contracts (Solidity)
├── scripts/           # Deployment scripts
├── test/              # Smart contract tests
├── frontend/          # React frontend application
└── hardhat.config.js  # Hardhat configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- MetaMask browser extension
- Git

### Installation Steps

1. Install Node.js dependencies (will be done in next steps)
2. Set up Hardhat for smart contract development
3. Set up React frontend
4. Connect to blockchain network
5. Deploy smart contracts
6. Run the application

## Quick Start (Windows)

A helper script `run.bat` is included to automate the local setup:

1. Install the prerequisites above (Node.js 18+, npm, MetaMask).
2. Clone the repository and open the project folder.
3. Double-click `run.bat` or run it from a terminal (`run.bat`).
   - The script checks for Node.js/npm.
   - Installs backend/frontend dependencies if they are missing.
   - Opens three terminals: Hardhat node, contract deployment, and the React app.
4. Keep the Hardhat node window open. After deployment finishes, copy the
   contract address from the deployment window and update `frontend/src/utils/contract.js`
   if it differs from the current value.
5. Configure MetaMask (Hardhat Local network: RPC `http://127.0.0.1:8545`, Chain ID `1337`) and
   import one of the private keys printed in the Hardhat terminal.
6. Access the app at [http://localhost:3000](http://localhost:3000).

---

## Next Steps

Follow the step-by-step setup instructions that will be provided in each phase.

## License

MIT

