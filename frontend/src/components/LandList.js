import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/contract';
import { formatAddress } from '../utils/contract';

/**
 * Component for listing all lands owned by the connected account
 */
function LandList({ provider, account, refreshTrigger }) {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (account && provider) {
      fetchLands();
    } else {
      setLands([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, provider, refreshTrigger]);

  const getStatusBadge = (status) => {
    const s = Number(status);
    if (s === 0) return <span className="badge bg-yellow-500/20 text-yellow-200">Pending Verification</span>;
    if (s === 1) return <span className="badge bg-green-500/20 text-green-200">Registered</span>;
    if (s === 2) return <span className="badge bg-red-500/20 text-red-200">Rejected</span>;
    return <span className="badge">Unknown</span>;
  };

  const fetchLands = async () => {
    if (!account || !provider) return;

    setLoading(true);
    setError('');

    try {
      const contract = await getContract(provider);

      // Get all land IDs owned by the account
      const landIds = await contract.getLandsByOwner(account);

      // Fetch details for each land
      const landDetails = await Promise.all(
        landIds.map(async (id) => {
          try {
            const land = await contract.getLandDetails(id);
            return {
              landId: land.landId.toString(),
              location: land.location,
              area: land.area.toString(),
              description: land.description,
              registrationDate: new Date(Number(land.registrationDate) * 1000).toLocaleString(),
              currentOwner: land.currentOwner,
              status: land.status
            };
          } catch (err) {
            console.error(`Error fetching land ${id}:`, err);
            return null;
          }
        })
      );

      // Filter out any null values
      setLands(landDetails.filter((land) => land !== null));
    } catch (err) {
      console.error('Error fetching lands:', err);
      setError(err.message || 'Failed to fetch your lands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="glass-panel">
        <h2 className="text-2xl font-semibold text-white">Connect wallet to view holdings</h2>
        <p className="mt-3 text-sm text-slate-300">
          Reconnect MetaMask to retrieve parcels associated with your address.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Module 04</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">My Land Registry</h2>
          <p className="mt-3 text-sm text-slate-300">
            Review every parcel linked to your wallet. Refresh to sync with on-chain events minted
            from other sessions.
          </p>
        </div>
        <button
          onClick={fetchLands}
          disabled={loading}
          className="secondary-btn"
        >
          {loading ? 'Refreshing...' : 'Refresh Holdings'}
        </button>
      </div>

      {error && (
        <div className="alert-card error mt-6">
          {error}
        </div>
      )}

      {loading && lands.length === 0 ? (
        <div className="mt-8 text-center text-sm text-slate-300">Loading your lands...</div>
      ) : lands.length === 0 ? (
        <div className="alert-card success mt-6">
          You don't own any registered lands yet. Mint a parcel to populate this view.
        </div>
      ) : (
        <div className="data-grid mt-8">
          {lands.map((land) => (
            <div key={land.landId} className="land-card">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Parcel #{land.landId}</h3>
                <span className="badge">{land.area} sq. meters</span>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 border-t border-white/5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-xs text-slate-400">Application Submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  {Number(land.status) === 1 ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                  ) : Number(land.status) === 2 ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <span className={`text-xs ${Number(land.status) === 1 ? 'text-green-400' :
                      Number(land.status) === 2 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                    Inspector: {
                      Number(land.status) === 1 ? 'Confirmed' :
                        Number(land.status) === 2 ? 'Rejected' : 'Pending'
                    }
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                {land.location || 'Unnamed parcel'}
              </p>
              {land.description && (
                <p className="mt-3 text-xs text-slate-400">{land.description}</p>
              )}
              <div className="mt-4 text-xs text-slate-400">
                Registered: {land.registrationDate}
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Current owner: {formatAddress(land.currentOwner)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LandList;

