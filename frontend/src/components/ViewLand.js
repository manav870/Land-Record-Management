import React, { useState } from 'react';
import { getContract } from '../utils/contract';
import { formatAddress } from '../utils/contract';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
  marginTop: '1rem'
};

/**
 * Component for viewing land details
 */
function ViewLand({ provider }) {
  const [landId, setLandId] = useState('');
  const [landData, setLandData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "", // Leave empty for development mode
    libraries,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLandData(null);
    setHistory([]);
    setLoading(true);

    try {
      if (!provider) {
        throw new Error('Connect your wallet to query parcel data.');
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
        latitude: land.latitude ? parseFloat(land.latitude) : null,
        longitude: land.longitude ? parseFloat(land.longitude) : null,
        area: land.area.toString(),
        description: land.description,
        registrationDate: new Date(Number(land.registrationDate) * 1000).toLocaleString(),
        exists: land.exists,
        status: land.status
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

  if (loadError) return <div className="text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="text-white">Loading Maps...</div>;

  return (
    <div className="glass-panel">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Module 03</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">View Land Details</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Query live on-chain data for any registered parcel. Inspect the latest owner and audit
            the complete provenance timeline.
          </p>
        </div>
        <span className="badge text-sky-200">Ledger lookup</span>
      </div>

      <form onSubmit={handleSearch} className="mt-7 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <input
            type="number"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            placeholder="Enter Land ID"
            min="1"
            className="input-field"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="primary-btn md:w-auto"
        >
          {loading ? 'Loading...' : 'Search Registry'}
        </button>
      </form>

      {error && (
        <div className="alert-card error">
          {error}
        </div>
      )}

      {landData && (
        <div className="mt-8 space-y-6">
          <div className="land-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-xs font-medium text-slate-300">1. Application Submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {Number(landData.status) === 1 ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : Number(landData.status) === 2 ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    <span className={`text-xs font-medium ${Number(landData.status) === 1 ? 'text-green-400' :
                        Number(landData.status) === 2 ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                      2. Inspector Status: {
                        Number(landData.status) === 1 ? 'Confirmed' :
                          Number(landData.status) === 2 ? 'Rejected' : 'Pending Review'
                      }
                    </span>
                  </div>
                </div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Parcel #{landData.landId}</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">{landData.location || 'Unnamed parcel'}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="badge">{landData.area} sq. meters</span>
                <span className="badge">
                  Owner: {formatAddress(landData.currentOwner)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300">
              {landData.description || 'No description provided'}
            </p>

            {landData.latitude && landData.longitude && (
              <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={15}
                  center={{ lat: landData.latitude, lng: landData.longitude }}
                  options={{
                    styles: [
                      {
                        elementType: "geometry",
                        stylers: [{ color: "#242f3e" }],
                      },
                      {
                        elementType: "labels.text.stroke",
                        stylers: [{ color: "#242f3e" }],
                      },
                      {
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#746855" }],
                      },
                    ],
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                >
                  <Marker position={{ lat: landData.latitude, lng: landData.longitude }} />
                </GoogleMap>
              </div>
            )}

            <div className="mt-5 text-xs uppercase tracking-[0.25em] text-slate-500">
              Registered on {landData.registrationDate}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Ownership History</h4>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record.index} className="land-card">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 space-y-1 text-sm text-slate-200">
                        <p>
                          <span className="text-slate-400">From:</span> {formatAddress(record.from)}
                        </p>
                        <p>
                          <span className="text-slate-400">To:</span> {formatAddress(record.to)}
                        </p>
                      </div>
                      <span className="badge text-xs text-slate-300">Transfer #{record.index}</span>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                      {record.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert-card success">
                No ownership transfers recorded. This is the original registration.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewLand;
