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
      setLands(landDetails.filter(land => land !== null));
    } catch (err) {
      console.error('Error fetching lands:', err);
      setError(err.message || 'Failed to fetch your lands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please connect your wallet to view your lands.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Lands</h2>
        <button
          onClick={fetchLands}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && lands.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading your lands...</p>
        </div>
      ) : lands.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You don't own any registered lands yet.</p>
          <p className="text-sm text-gray-500 mt-2">Register a new land to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lands.map((land) => (
            <div key={land.landId} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition duration-200">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-indigo-600">Land ID: {land.landId}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">{land.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Area</p>
                  <p className="font-semibold text-gray-800">{land.area} sq. meters</p>
                </div>
                {land.description && (
                  <div>
                    <p className="text-gray-600">Description</p>
                    <p className="text-gray-800 line-clamp-2">{land.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Registered</p>
                  <p className="text-gray-800">{land.registrationDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LandList;

