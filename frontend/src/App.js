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

  const renderMetaMaskRequired = () => (
    <section className="glass-panel text-center animate-in fade-in">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-10 w-10 fill-none stroke-[1.6] text-cyan-300"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m12 3 8.5 4.9-3.1 12.2H6.6L3.5 7.9 12 3Zm0 0 4.7 16.1M12 3 7.3 19.1"
          />
        </svg>
      </div>
      <h2 className="headline mb-4">MetaMask Required</h2>
      <p className="subheadline mx-auto">
        Install MetaMask to sign transactions and anchor land records on-chain. Once installed,
        refresh this page and reconnect your wallet to continue.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          className="primary-btn"
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download MetaMask
        </a>
        <span className="secondary-btn">
          Need help? Head to <span className="text-cyan-300">docs.metamask.io</span>
        </span>
      </div>
    </section>
  );

  const renderConnectPrompt = () => (
    <section className="glass-panel text-center animate-in fade-in">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-10 w-10 fill-none stroke-[1.6] text-violet-300"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.75c-4.556 0-8.25 3.694-8.25 8.25s3.694 8.25 8.25 8.25 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75Zm0 0v8.25l5.197 3"
          />
        </svg>
      </div>
      <h2 className="headline mb-3">Activate Your Registry Console</h2>
      <p className="subheadline mx-auto">
        Link your blockchain identity to mint parcels, orchestrate ownership transfers, and query
        the immutable land ledger in real time.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={connectWallet}
          disabled={loading}
          className="primary-btn"
        >
          {loading ? 'Connecting...' : 'Connect MetaMask Wallet'}
        </button>
        <span className="text-sm text-slate-400">
          Ensure you are on the <span className="text-cyan-300">Hardhat Local</span> or
          <span className="text-violet-300"> Mumbai Testnet</span> network.
        </span>
      </div>
    </section>
  );

  const renderConnected = () => (
    <div className="space-y-8 animate-in fade-in">
      <div className="glass-panel py-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Control Center</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Land Registry Operations Console
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Mint parcels, orchestrate ownership transfers, and audit history with cryptographic
              certainty.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="status-badge">
              <span className="status-dot" />
              Connected
            </span>
            <span className="badge text-slate-200">Wallet: {account?.slice(0, 6)}…{account?.slice(-4)}</span>
            <button onClick={disconnectWallet} className="secondary-btn">
              Disconnect
            </button>
          </div>
        </div>
      </div>

      <Home provider={provider} account={account} />
    </div>
  );

  return (
    <div className="app-shell">
      <Navbar account={account} onDisconnect={disconnectWallet} />

      <main className="mx-auto mt-12 flex max-w-6xl flex-col gap-10">
        {!isMetaMaskInstalled() && renderMetaMaskRequired()}
        {isMetaMaskInstalled() && !isConnected && renderConnectPrompt()}
        {isMetaMaskInstalled() && isConnected && renderConnected()}
      </main>

      <footer className="mt-20 flex flex-col items-center gap-2 text-center text-xs text-slate-400">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <p>If you're reading this, our project compiled successfully.</p>
        <p className="text-slate-300">
          Project made by <span className="text-cyan-300">Manav</span>, <span className="text-cyan-300">Meet</span>, <span className="text-cyan-300">Vansh</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
