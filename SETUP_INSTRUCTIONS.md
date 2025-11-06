# Setup Instructions

## Step 2 Completed: Hardhat Configuration

### What Was Installed:

1. **Hardhat** - Development framework for Ethereum
2. **Hardhat Toolbox** - Collection of plugins for Hardhat
3. **OpenZeppelin Contracts** - Secure smart contract library
4. **dotenv** - For managing environment variables

### Files Created:

- `hardhat.config.js` - Hardhat configuration file
  - Configured for Solidity 0.8.20
  - Set up for local Hardhat network (chainId: 1337)
  - Configured for Polygon Mumbai testnet (chainId: 80001)

### Available Commands:

- `npm run compile` - Compile smart contracts
- `npm run test` - Run tests
- `npm run deploy` - Deploy contracts
- `npm run node` - Start local Hardhat network

### Next Steps:

You'll need to create a `.env` file (optional for now) when you're ready to deploy to testnet:
- Copy `.env.example` to `.env` (if it exists)
- Add your private key and RPC URL

For now, you can use the local Hardhat network for development and testing.

