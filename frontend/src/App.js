import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectMetaMask, getCurrentAccount, isMetaMaskInstalled } from './utils/contract';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled() && window.ethereum.selectedAddress) {
        try {
          const prov = new ethers.BrowserProvider(window.ethereum);
          const acc = await getCurrentAccount(prov);
          if (acc) {
            setProvider(prov);
            setAccount(acc);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setAccount(null);
          setProvider(null);
          setIsConnected(false);
        } else {
          checkConnection();
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const prov = await connectMetaMask();
      const acc = await getCurrentAccount(prov);
      
      setProvider(prov);
      setAccount(acc);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar account={account} onDisconnect={disconnectWallet} />
      
      <div className="container mx-auto px-4 py-8">
        {!isMetaMaskInstalled() ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                MetaMask Required
              </h2>
              <p className="text-red-600 mb-6">
                MetaMask is not installed. Please install MetaMask to use this application.
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Download MetaMask
              </a>
            </div>
            <div className="text-left bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">What is MetaMask?</h3>
              <p className="text-sm text-gray-600">
                MetaMask is a cryptocurrency wallet that allows you to interact with blockchain applications.
                It's required to connect to the Land Record Management System and perform transactions.
              </p>
            </div>
          </div>
        ) : !isConnected ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Land Record Management
            </h2>
            <p className="text-gray-600 mb-8">
              Connect your MetaMask wallet to get started with managing land records on the blockchain.
            </p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
            </button>
            <div className="mt-6 text-sm text-gray-500">
              <p>Make sure you're connected to the correct network (Hardhat Local or Mumbai Testnet)</p>
            </div>
          </div>
        ) : (
          <Home provider={provider} account={account} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <p>Land Record Management System - Built on Blockchain</p>
        <p className="mt-2">Secure • Transparent • Immutable</p>
      </footer>
    </div>
  );
}

export default App;
