
export const contractConst = "0x7CEdb032626F74Ff6cbe2D53E4862b63b71a5CF6";

// ОПРЕДЕЛЯЕМ КАСТОМНУЮ СЕТЬ С ПУБЛИЧНЫМ RPC Вместо строки "conflux espace testnet"
export const chainConst = {
  chainId: 71, // ID сети Conflux eSpace Testnet
  rpc: ["https://evmtestnet.confluxrpc.com"], // Публичный RPC-узёл
  nativeCurrency: {
    name: "Conflux",
    symbol: "CFX",
    decimals: 18,
  },
  shortName: "cfx-espace-testnet",
  slug: "conflux-espace-testnet",
  testnet: true,
  chain: "Conflux eSpace Testnet",
};

// Оставляем пустую строку, так как мы не используем ключи thirdweb
export const clientIdConst = ""; 

// Configure the primary color for buttons and other UI elements
export const primaryColorConst = "blue";

// Choose between "light" and "dark" mode
export const themeConst = "dark";

// Gasless relayer configuration options
export const relayerUrlConst = ""; // OpenZeppelin relayer URL
export const biconomyApiKeyConst = ""; // Biconomy API key
export const biconomyApiIdConst = ""; // Biconomy API ID
