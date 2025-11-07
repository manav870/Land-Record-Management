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
              currentOwner: land.currentOwner
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

