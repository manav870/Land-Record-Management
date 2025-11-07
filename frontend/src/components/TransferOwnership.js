import React, { useState } from 'react';
import { getContract } from '../utils/contract';

/**
 * Component for transferring land ownership
 */
function TransferOwnership({ provider, account, onSuccess }) {
  const [formData, setFormData] = useState({
    landId: '',
    newOwner: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      if (!formData.landId || parseInt(formData.landId) <= 0) {
        throw new Error('Valid Land ID is required');
      }
      if (!formData.newOwner.trim()) {
        throw new Error('New owner address is required');
      }

      // Basic address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(formData.newOwner.trim())) {
        throw new Error('Invalid Ethereum address format');
      }

      // Get contract instance
      const contract = await getContract(provider);

      // Transfer ownership
      const tx = await contract.transferOwnership(
        formData.landId,
        formData.newOwner.trim()
      );

      setSuccess('Transaction submitted! Waiting for confirmation...');

      // Wait for transaction to be mined
      await tx.wait();

      setSuccess('Ownership transferred successfully!');

      // Reset form
      setFormData({
        landId: '',
        newOwner: ''
      });

      // Notify parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error transferring ownership:', err);
      setError(err.message || 'Failed to transfer ownership. Please check if you are the owner and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="glass-panel">
        <h2 className="text-2xl font-semibold text-white">Wallet connection required</h2>
        <p className="mt-3 text-sm text-slate-300">
          Connect your wallet to authorize ownership transfers. Only current owners can initiate a
          transfer.
        </p>
        <div className="alert-card error mt-6">
          Connect MetaMask and select the parcel to continue.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Module 02</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Transfer Ownership</h2>
          <p className="mt-3 max-w-xl text-sm text-slate-300">
            Reassign parcel ownership to a new wallet. The transaction executes with real-time
            verification and transparent provenance.
          </p>
        </div>
        <span className="badge text-violet-200">Secure handoff</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="landId" className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Land ID
            </label>
            <input
              type="number"
              id="landId"
              name="landId"
              value={formData.landId}
              onChange={handleChange}
              required
              min="1"
              className="input-field mt-2"
              placeholder="Enter the land ID to transfer"
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="newOwner" className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              New Owner Address
            </label>
            <input
              type="text"
              id="newOwner"
              name="newOwner"
              value={formData.newOwner}
              onChange={handleChange}
              required
              className="input-field mt-2 font-mono text-sm"
              placeholder="0x..."
            />
            <p className="mt-2 text-xs text-slate-400">Ensure the address is a valid EVM wallet.</p>
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
          {loading ? 'Transferring...' : 'Transfer Ownership'}
        </button>
      </form>
    </div>
  );
}

export default TransferOwnership;

