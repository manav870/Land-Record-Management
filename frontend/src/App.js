import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectMetaMask, getCurrentAccount, isMetaMaskInstalled } from './utils/contract';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Land Record Management System
          </h1>
          <p className="text-gray-600">
            Blockchain-based decentralized land registry
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {!isMetaMaskInstalled() ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                MetaMask is not installed. Please install MetaMask to continue.
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download MetaMask
              </a>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-8">
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  <span className="font-semibold">Connected:</span>{' '}
                  {account}
                </p>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Frontend structure is ready. Components will be added in the next step.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
