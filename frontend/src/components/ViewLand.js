import React, { useState } from 'react';
import { getContract } from '../utils/contract';
import { formatAddress } from '../utils/contract';

/**
 * Component for viewing land details
 */
function ViewLand({ provider }) {
  const [landId, setLandId] = useState('');
  const [landData, setLandData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLandData(null);
    setHistory([]);
    setLoading(true);

    try {
      if (!provider) {
        throw new Error('Please connect your wallet to view land details');
      }
      if (!landId || parseInt(landId) <= 0) {
        throw new Error('Please enter a valid Land ID');
      }

      const contract = await getContract(provider);

      // Get land details
      const land = await contract.getLandDetails(landId);
      
      // Get ownership history
      const ownershipHistory = await contract.getOwnershipHistory(landId);

      // Format land data
      const formattedLand = {
        landId: land.landId.toString(),
        currentOwner: land.currentOwner,
        location: land.location,
        area: land.area.toString(),
        description: land.description,
        registrationDate: new Date(Number(land.registrationDate) * 1000).toLocaleString(),
        exists: land.exists
      };

      // Format history
      const formattedHistory = ownershipHistory.map((record, index) => ({
        index: index + 1,
        from: record.from,
        to: record.to,
        timestamp: new Date(Number(record.timestamp) * 1000).toLocaleString()
      }));

      setLandData(formattedLand);
      setHistory(formattedHistory);
    } catch (err) {
      console.error('Error fetching land data:', err);
      setError(err.message || 'Failed to fetch land data. Please check the Land ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please connect your wallet to view land details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">View Land Details</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="number"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder="Enter Land ID"
            min="1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {landData && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Land Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Land ID</p>
                <p className="font-semibold text-gray-800">{landData.landId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Owner</p>
                <p className="font-mono text-sm text-gray-800">{formatAddress(landData.currentOwner)}</p>
                <p className="font-mono text-xs text-gray-500">{landData.currentOwner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-800">{landData.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-semibold text-gray-800">{landData.area} sq. meters</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-800">{landData.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="text-gray-800">{landData.registrationDate}</p>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ownership History</h3>
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record.index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Transfer #{record.index}</p>
                        <p className="text-sm">
                          <span className="font-semibold">From:</span>{' '}
                          <span className="font-mono">{formatAddress(record.from)}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">To:</span>{' '}
                          <span className="font-mono">{formatAddress(record.to)}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{record.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {history.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              No ownership transfers recorded. This is the original registration.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewLand;

