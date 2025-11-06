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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please connect your wallet to transfer ownership.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transfer Ownership</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="landId" className="block text-sm font-medium text-gray-700 mb-2">
            Land ID *
          </label>
          <input
            type="number"
            id="landId"
            name="landId"
            value={formData.landId}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter land ID to transfer"
          />
        </div>

        <div>
          <label htmlFor="newOwner" className="block text-sm font-medium text-gray-700 mb-2">
            New Owner Address *
          </label>
          <input
            type="text"
            id="newOwner"
            name="newOwner"
            value={formData.newOwner}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            placeholder="0x..."
          />
          <p className="mt-1 text-xs text-gray-500">Enter the Ethereum address of the new owner</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Transferring...' : 'Transfer Ownership'}
        </button>
      </form>
    </div>
  );
}

export default TransferOwnership;

