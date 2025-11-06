import React, { useState } from 'react';
import RegisterLand from '../components/RegisterLand';
import TransferOwnership from '../components/TransferOwnership';
import ViewLand from '../components/ViewLand';
import LandList from '../components/LandList';

/**
 * Home page component with all main features
 */
function Home({ provider, account }) {
  const [activeTab, setActiveTab] = useState('register');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    // Trigger refresh of land list
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'register', label: 'Register Land', icon: '📝' },
    { id: 'transfer', label: 'Transfer Ownership', icon: '🔄' },
    { id: 'view', label: 'View Land', icon: '🔍' },
    { id: 'myLands', label: 'My Lands', icon: '🏠' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'register' && (
          <RegisterLand 
            provider={provider} 
            account={account} 
            onSuccess={handleSuccess}
          />
        )}
        
        {activeTab === 'transfer' && (
          <TransferOwnership 
            provider={provider} 
            account={account} 
            onSuccess={handleSuccess}
          />
        )}
        
        {activeTab === 'view' && (
          <ViewLand provider={provider} />
        )}
        
        {activeTab === 'myLands' && (
          <LandList 
            provider={provider} 
            account={account} 
            refreshTrigger={refreshTrigger}
          />
        )}
      </div>
    </div>
  );
}

export default Home;

