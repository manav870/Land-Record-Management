# Land Record Management System

A blockchain-based land record management system built on Ethereum using Solidity smart contracts and React frontend. This decentralized application provides a transparent, secure, and immutable way to manage land ownership records.

## Project Overview

This project implements a decentralized land record management system that:
- Registers land parcels on the blockchain
- Tracks ownership transfers
- Maintains immutable ownership history
- Provides transparent and secure land records
- Enables easy verification of land ownership

## Technology Stack

- **Blockchain:** Ethereum (Local Hardhat Network / Polygon Mumbai Testnet)
- **Smart Contracts:** Solidity 0.8.x
- **Development Framework:** Hardhat
- **Frontend:** React.js with Ethers.js
- **Styling:** Tailwind CSS
- **Wallet Integration:** MetaMask

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MetaMask** browser extension - [Install here](https://metamask.io/)
- **Git** (for cloning the repository)

## Installation

### Method 1: Direct Install (Recommended for Windows)

The easiest way to get started is using the automated setup script. This method automatically installs dependencies and launches all required services.

#### Steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Land Record Management"
   ```

2. **Run the setup script:**
   - **Option A:** Double-click `run.bat` in the project root directory
   - **Option B:** Run from command prompt:
     ```bash
     run.bat
     ```

3. **What the script does:**
   - Checks for Node.js and npm installation
   - Installs backend dependencies (Hardhat, OpenZeppelin, etc.)
   - Installs frontend dependencies (React, Ethers.js, Tailwind CSS, etc.)
   - Launches three terminal windows:
     - **Terminal 1:** Hardhat local blockchain node
     - **Terminal 2:** Smart contract deployment
     - **Terminal 3:** React frontend development server

4. **Configure MetaMask:**
   - Open MetaMask extension
   - Click on network dropdown → "Add Network" → "Add a network manually"
   - Enter the following details:
     - **Network Name:** Hardhat Local
     - **RPC URL:** `http://127.0.0.1:8545`
     - **Chain ID:** `1337`
     - **Currency Symbol:** ETH
   - Import an account using one of the private keys displayed in the Hardhat node terminal (Terminal 1)

5. **Update Contract Address (if needed):**
   - After deployment completes, check Terminal 2 for the contract address
   - If it differs from the existing address, update `frontend/src/utils/contract.js` with the new address

6. **Access the Application:**
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
   - The React app will automatically reload when you make changes

**Note:** Keep the Hardhat node terminal (Terminal 1) open while using the application. You can close the deployment terminal (Terminal 2) after deployment completes.

---

### Method 2: Manual Installation

If you prefer to set up the project manually or are using a non-Windows system, follow these steps:

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Land Record Management"
```

#### Step 2: Install Backend Dependencies

Install all required packages for the Hardhat smart contract development environment:

```bash
npm install
```

This installs:
- Hardhat and Hardhat Toolbox
- OpenZeppelin Contracts
- dotenv for environment variables

#### Step 3: Install Frontend Dependencies

Navigate to the frontend directory and install React dependencies:

```bash
cd frontend
npm install
cd ..
```

This installs:
- React and React DOM
- Ethers.js for blockchain interaction
- Tailwind CSS for styling
- React Scripts for development

#### Step 4: Start Hardhat Local Network

Open a terminal and start the local Hardhat blockchain:

```bash
npm run node
```

Keep this terminal open. You'll see:
- A list of accounts with their private keys
- The local network running on `http://127.0.0.1:8545`

#### Step 5: Deploy Smart Contracts

Open a **new terminal** (keep the Hardhat node running) and deploy the contracts:

```bash
npm run deploy
```

This will:
- Compile the smart contracts
- Deploy them to the local Hardhat network
- Display the deployed contract address

**Important:** Copy the contract address from the deployment output.

#### Step 6: Update Contract Address

Update the contract address in the frontend configuration:

1. Open `frontend/src/utils/contract.js`
2. Replace the `CONTRACT_ADDRESS` value with the address from Step 5

#### Step 7: Configure MetaMask

1. Open MetaMask extension in your browser
2. Click on the network dropdown → "Add Network" → "Add a network manually"
3. Enter the following:
   - **Network Name:** Hardhat Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** ETH
4. Import an account:
   - Click on account icon → "Import Account"
   - Paste one of the private keys from the Hardhat node terminal (Step 4)
   - This account will have test ETH for transactions

#### Step 8: Start the Frontend

Open a **new terminal** and start the React development server:

```bash
cd frontend
npm start
```

The application will automatically open in your browser at [http://localhost:3000](http://localhost:3000)

#### Step 9: Verify Installation

- The React app should load without errors
- Connect MetaMask to the Hardhat Local network
- You should be able to interact with the smart contract

---

## Project Structure

```
Land Record Management/
├── contracts/              # Smart contracts (Solidity)
│   └── LandRegistry.sol   # Main land registry contract
├── scripts/                # Deployment and utility scripts
│   └── deploy.js          # Contract deployment script
├── test/                   # Smart contract tests
│   └── LandRegistry.test.js
├── frontend/               # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Navbar.js
│   │   │   ├── RegisterLand.js
│   │   │   ├── ViewLand.js
│   │   │   ├── TransferOwnership.js
│   │   │   └── LandList.js
│   │   ├── pages/         # Page components
│   │   │   └── Home.js
│   │   ├── utils/         # Utility functions
│   │   │   └── contract.js # Contract configuration
│   │   └── App.js         # Main App component
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Backend dependencies
├── run.bat                # Windows quick start script
└── README.md              # This file
```

## Available Commands

### Backend Commands (Root Directory)

```bash
npm run compile    # Compile smart contracts
npm run test       # Run smart contract tests
npm run deploy     # Deploy contracts to local network
npm run node       # Start local Hardhat blockchain
```

### Frontend Commands (Frontend Directory)

```bash
npm start          # Start React development server
npm run build      # Build for production
npm test           # Run frontend tests
```

## Usage

Once the application is running:

1. **Connect MetaMask:** Ensure MetaMask is connected to the Hardhat Local network
2. **Register Land:** Use the "Register Land" feature to add new land parcels
3. **View Land:** Search and view land details by ID
4. **Transfer Ownership:** Transfer land ownership to another address
5. **View All Lands:** Browse all registered land parcels

## Troubleshooting

### Common Issues:

1. **"Contract not deployed" error:**
   - Ensure the Hardhat node is running
   - Verify the contract address in `frontend/src/utils/contract.js` matches the deployed address

2. **MetaMask connection issues:**
   - Check that MetaMask is connected to Hardhat Local network (Chain ID: 1337)
   - Ensure you're using an account imported from the Hardhat node

3. **Port already in use:**
   - If port 3000 is busy, React will prompt to use another port
   - If port 8545 is busy, stop any other blockchain nodes running

4. **Dependencies not installing:**
   - Ensure Node.js v18+ is installed
   - Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

## Development

### Smart Contract Development

- Edit contracts in `contracts/` directory
- Compile with `npm run compile`
- Test with `npm run test`
- Deploy with `npm run deploy`

### Frontend Development

- Edit React components in `frontend/src/`
- The development server auto-reloads on changes
- Styling is done with Tailwind CSS

---

## Final Notes (Because We're All Suffering Together)

**For Fellow Students:**
- If your Hardhat node crashes at 3 AM, you're not alone. We've all been there.
- The contract address you copied? Yeah, double-check it. Trust us.
- MetaMask giving you grief? Welcome to Web3 development. It's not a bug, it's a feature.
- Remember: "It works on my machine" is the blockchain equivalent of "The dog ate my homework."

**Pro Tips:**
- Keep the Hardhat node running. Seriously. Don't close it. We know you will anyway.
- That one test that keeps failing? It's probably fine. Ship it.
- Documentation? We wrote it at 2 AM. Good luck.

**For Professors/Graders:**
- Yes, we tested it. Mostly.
- No, we don't know why it works sometimes and not others. That's the beauty of blockchain.
- The code is self-documenting (if you squint hard enough).

**Real Talk:**
This project taught us that:
1. Smart contracts are smart until they're not
2. React hooks are more addictive than actual hooks
3. Blockchain is just a fancy database that costs money to write to
4. We probably should have started earlier

**Support:**
If you find bugs, congratulations! You found them before we did. Pull requests welcome. Complaints can be sent to `/dev/null`.

---

*Made with ❤️, ☕, and questionable life choices.*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**License created by:** Manav Patel

*(Because we're generous like that, or maybe just too tired to argue)*

