# Monad Chronicles 🚀

A modern web application for minting the **Monad Chronicles** NFT collection (ERC-721 standard), deployed on the **Conflux eSpace Testnet**. The project is powered by **Vite** to ensure blazing-fast development and optimized production builds.

<p align="center">
  <img src="https://github.com/user-attachments/assets/764237b8-b0aa-4f6c-828e-108f5063619b" alt="Monad Chronicles Interface" width="800">
</p>


## 🛠 Tech Stack

- **Frontend:** Vite, React.js / Vue.js / Vanilla JS (*choose your framework*)
- **Smart Contract:** Solidity, ERC-721 (OpenZeppelin)
- **Blockchain Network:** Conflux eSpace (Testnet)
- **Web3 Provider:** Ethers.js / Web3.js / Viem / Wagmi (*choose your library*)

## 🚀 Features

- **MetaMask Integration:** Seamless connection to the Conflux eSpace Testnet.
- **Live Minting Progress:** Displays real-time supply status (e.g., `Minted 12 / 1000`).
- **Flexible Minting:** Clean user interface to mint single or multiple NFTs in one transaction.
- **Responsive Design:** Fully optimized for both desktop and mobile devices.

## 📋 Prerequisites

To run this project locally, you will need:
- **Node.js** (v16.x or higher)
- **npm** or **yarn** package manager
- **MetaMask** extension installed in your browser with Conflux eSpace Testnet configured.

## 🔧 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd monad-chronicles
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example` and provide your contract address:
   ```env
   VITE_CONTRACT_ADDRESS=0xYourContractAddress
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open `http://localhost:5173` in your browser to see the app.

## 📦 Production Build

To create an optimized production build, run:
```bash
npm run build
```
The production-ready files will be generated in the `dist/` folder.

## 🌐 Useful Links


- **Live Application:** <a href="https://YOUR_APP_URL.com" target="_blank" rel="noopener noreferrer">Launch Monad Chronicles App</a>
- **Privacy Policy:** <a href="https://antoy365.github.io/privacy-policy/" target="_blank" rel="noopener noreferrer">Read Privacy Policy</a>
- **Smart Contract on ConfluxScan:** <a href="https://confluxscan.io" target="_blank" rel="noopener noreferrer">0x7CEdb032626F74Ff6cbe2D53E4862b63b71a5CF6</a>
- **Conflux eSpace Network Setup:** <a href="https://confluxnetwork.org" target="_blank" rel="noopener noreferrer">Conflux Documentation</a>
- **Get Free Testnet CFX:** <a href="https://evmtestnet.confluxscan.org/" target="_blank" rel="noopener noreferrer">Conflux Faucet</a>


---
*Created as part of the Monad Chronicles NFT Drop project. If you like it, please give it a ⭐!*
