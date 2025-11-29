import React, { useState } from 'react';
import RegisterLand from '../components/RegisterLand';
import TransferOwnership from '../components/TransferOwnership';
import ViewLand from '../components/ViewLand';
import LandList from '../components/LandList';
import AdminDashboard from '../components/AdminDashboard';

const TabIcon = ({ type }) => {
  const baseProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    className: 'h-4 w-4 stroke-[1.7]'
  };

  switch (type) {
    case 'register':
      return (
        <svg {...baseProps}>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75h10.125M9 12h10.125M9 17.25H12M4.875 6.75h.008v.008h-.008V6.75Zm0 5.25h.008v.008h-.008V12Zm0 5.25h.008v.008h-.008V17.25Z"
          />
        </svg>
      );
    case 'transfer':
      return (
        <svg {...baseProps}>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 4.5 21 9l-4.5 4.5m-9-9L3 9l4.5 4.5M21 9h-6M9 9H3m9 6v4.5m0 0 2.25-2.25M12 19.5 9.75 17.25"
          />
        </svg>
      );
    case 'view':
      return (
        <svg {...baseProps}>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178ZM12 15.375a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75Z"
          />
        </svg>
      );
    case 'admin':
      return (
        <svg {...baseProps}>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>
      );
    default:
      return (
        <svg {...baseProps}>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5v15m7.5-15v15M5.25 8.25v7.5m13.5-7.5v7.5"
          />
        </svg>
      );
  }
};

/**
 * Home page component with all main features
 */
function Home({ provider, account }) {
  const [activeTab, setActiveTab] = useState('register');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    // Trigger refresh of land list
    setRefreshTrigger((prev) => prev + 1);
  };

  const tabs = [
    {
      id: 'register',
      label: 'Register Land',
      icon: 'register',
      description: 'Mint immutable proofs for new parcels'
    },
    {
      id: 'transfer',
      label: 'Transfer Ownership',
      icon: 'transfer',
      description: 'Reassign parcels with cryptographic assurance'
    },
    {
      id: 'view',
      label: 'View Land',
      icon: 'view',
      description: 'Query parcel metadata and provenance trail'
    },
    {
      id: 'myLands',
      label: 'My Lands',
      icon: 'list',
      description: 'Inspect all holdings associated with your wallet'
    },
    {
      id: 'admin',
      label: 'Inspector Dashboard',
      icon: 'admin',
      description: 'Government verification portal (Admin Only)'
    }
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Command Modules</p>
          <h3 className="text-3xl font-semibold text-white">Select a capability to operate</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Each module executes smart-contract transactions with audit-grade precision. Choose a
            workflow to begin orchestrating land registry events on-chain.
          </p>
        </div>
      </div>

      <div className="feature-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`feature-tab ${activeTab === tab.id ? 'active' : ''}`}
            type="button"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
              <TabIcon type={tab.icon} />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-sm font-semibold leading-tight">{tab.label}</span>
              <span className="hidden text-xs text-slate-400 md:block">{tab.description}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="animate-in fade-in">
        {activeTab === 'register' && (
          <RegisterLand provider={provider} account={account} onSuccess={handleSuccess} />
        )}

        {activeTab === 'transfer' && (
          <TransferOwnership provider={provider} account={account} onSuccess={handleSuccess} />
        )}

        {activeTab === 'view' && <ViewLand provider={provider} />}

        {activeTab === 'myLands' && (
          <LandList provider={provider} account={account} refreshTrigger={refreshTrigger} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard provider={provider} account={account} />
        )}
      </div>
    </section>
  );
}

export default Home;

