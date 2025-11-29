import { ethers } from 'ethers';
import LandRegistryABI from '../contracts/LandRegistry.json';

// Contract configuration
// Update this address after deploying the contract
const CONTRACT_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'; // Default Hardhat local address

/**
 * Get the contract instance
 * @param {ethers.BrowserProvider} provider - The ethers provider
 * @param {string} contractAddress - The contract address (optional)
 * @returns {ethers.Contract} The contract instance
 */
export const getContract = async (provider, contractAddress = CONTRACT_ADDRESS) => {
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, LandRegistryABI.abi, signer);
};

/**
 * Get the contract address
 * @returns {string} The contract address
 */
export const getContractAddress = () => {
  return CONTRACT_ADDRESS;
};

/**
 * Check if MetaMask is installed
 * @returns {boolean} True if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined';
};

/**
 * Connect to MetaMask
 * @returns {Promise<ethers.BrowserProvider>} The provider instance
 */
export const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Create provider
  const provider = new ethers.BrowserProvider(window.ethereum);

  return provider;
};

/**
 * Get the current account
 * @param {ethers.BrowserProvider} provider - The ethers provider
 * @returns {Promise<string>} The current account address
 */
export const getCurrentAccount = async (provider) => {
  const accounts = await provider.listAccounts();
  return accounts[0]?.address || null;
};

/**
 * Format address for display
 * @param {string} address - The address to format
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

