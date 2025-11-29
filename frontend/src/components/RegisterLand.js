import React, { useState, useCallback } from 'react';
import { getContract } from '../utils/contract';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
  marginTop: '0.5rem'
};
const center = {
  lat: 20.5937, // India center
  lng: 78.9629
};

/**
 * Component for registering new land parcels
 */
function RegisterLand({ provider, account, onSuccess }) {
  const [formData, setFormData] = useState({
    location: '',
    area: '',
    description: ''
  });
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "", // Leave empty for development mode (will show watermark)
    libraries,
  });

  const onMapClick = useCallback((event) => {
    setCoordinates({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.location.trim()) {
        throw new Error('Location is required');
      }
      if (!formData.area || parseFloat(formData.area) <= 0) {
        throw new Error('Area must be greater than zero');
      }
      if (!coordinates) {
        throw new Error('Please select a location on the map');
      }

      // Get contract instance
      const contract = await getContract(provider);

      // Register land
      const tx = await contract.registerLand(
        formData.location.trim(),
        coordinates.lat.toString(),
        coordinates.lng.toString(),
        formData.area,
        formData.description.trim()
      );

      setSuccess('Transaction submitted! Waiting for confirmation...');

      // Wait for transaction to be mined
      await tx.wait();

      setSuccess('Land registered successfully! Land ID will be available after confirmation.');

      // Reset form
      setFormData({
        location: '',
        area: '',
        description: ''
      });
      setCoordinates(null);

      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error registering land:', err);
      setError(err.message || 'Failed to register land. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="glass-panel">
        <h2 className="text-2xl font-semibold text-white">Connect wallet to register parcels</h2>
        <p className="mt-3 text-sm text-slate-300">
          The registry needs a signing authority before minting new land records. Connect your
          wallet to continue.
        </p>
        <div className="alert-card error mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
          >
            <path
              fill="currentColor"
              d="M12 22q-2.075 0-3.9-.788T4.65 19.35 2.788 15.9 2 12t.788-3.9T4.65 4.65 8.1 2.788 12 2t3.9.788T19.35 4.65t1.862 3.45T22 12q0 2.075-.788 3.9T19.35 19.35t-3.45 1.862T12 22Zm0-3q1.725 0 3.237-.65t2.637-1.763T19.35 13.35 20 12q0-1.725-.65-3.238t-1.763-2.637T13.35 3.65 12 3q-1.725 0-3.238.65T6.125 5.063 4.65 8.1 4 12q0 1.725.65 3.238t1.763 2.637T10.65 20.35 12 21ZM11 7h2v6h-2V7Zm0 8h2v2h-2v-2Z"
            />
          </svg>
          <div>
            <p className="font-medium">Wallet signature required</p>
            <p className="text-xs text-slate-200/70">Connect MetaMask to unlock land registration tools.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) return <div className="text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="text-white">Loading Maps...</div>;

  return (
    <div className="glass-panel">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Module 01</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Register New Land</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Anchor a new parcel into the blockchain ledger. Provide the parcel metadata, verify the
            details, and execute the minting transaction.
          </p>
        </div>
        <span className="badge text-cyan-200">On-chain mint</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Location / Address
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="input-field mt-2"
              placeholder="e.g., 123 Ridgeway Avenue, Sector 07"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Pin Location on Map
            </label>
            <div className="mt-2 overflow-hidden rounded-lg border border-white/10">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={5}
                center={center}
                onClick={onMapClick}
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
                {coordinates && <Marker position={coordinates} />}
              </GoogleMap>
            </div>
            {coordinates && (
              <p className="mt-2 text-xs text-cyan-300">
                Selected: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="area" className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Area (square meters)
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              className="input-field mt-2"
              placeholder="e.g., 1045"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="textarea-field mt-2"
              placeholder="Additional metadata, land survey IDs, zoning info..."
            />
          </div>
        </div>

        {error && (
          <div className="alert-card error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert-card success">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="primary-btn w-full"
        >
          {loading ? 'Registering...' : 'Register Land'}
        </button>
      </form>
    </div>
  );
}

export default RegisterLand;

