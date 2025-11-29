import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/contract';
import { formatAddress } from '../utils/contract';

/**
 * Component for Admin Dashboard
 */
function AdminDashboard({ provider, account }) {
    const [pendingLands, setPendingLands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // ID of land being processed
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (account && provider) {
            fetchPendingLands();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, provider]);

    const fetchPendingLands = async () => {
        if (!account || !provider) return;

        setLoading(true);
        setError('');

        try {
            const contract = await getContract(provider);

            // Get total lands count
            const totalLands = await contract.getTotalLands();
            const count = Number(totalLands);

            const pending = [];

            // Iterate through all lands (naive approach, okay for demo)
            // In production, you'd want an event indexer or a "getPendingLands" function in contract
            for (let i = 1; i <= count; i++) {
                try {
                    const land = await contract.getLandDetails(i);
                    // Status 0 is PENDING
                    if (Number(land.status) === 0) {
                        pending.push({
                            landId: land.landId.toString(),
                            location: land.location,
                            area: land.area.toString(),
                            description: land.description,
                            registrationDate: new Date(Number(land.registrationDate) * 1000).toLocaleString(),
                            currentOwner: land.currentOwner
                        });
                    }
                } catch (err) {
                    console.error(`Error fetching land ${i}:`, err);
                }
            }

            setPendingLands(pending);
        } catch (err) {
            console.error('Error fetching pending lands:', err);
            setError('Failed to fetch pending lands.');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (landId, action) => {
        console.log(`Starting ${action} for land ${landId}`);
        setActionLoading(landId);
        setError('');
        setSuccess('');

        try {
            const contract = await getContract(provider);
            let tx;

            console.log('Sending transaction...');
            if (action === 'approve') {
                tx = await contract.approveLand(landId);
            } else {
                tx = await contract.rejectLand(landId);
            }

            setSuccess(`Transaction submitted! Waiting for confirmation...`);
            console.log('Transaction hash:', tx.hash);

            await tx.wait();
            console.log('Transaction confirmed!');

            setSuccess(`Land ${landId} ${action}d successfully! Refreshing list...`);

            // Add a small delay to ensure node updates
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Refresh list
            await fetchPendingLands();
        } catch (err) {
            console.error(`Error ${action}ing land:`, err);
            setError(err.message || `Failed to ${action} land.`);
        } finally {
            setActionLoading(null);
        }
    };

    if (!account) {
        return (
            <div className="glass-panel">
                <h2 className="text-2xl font-semibold text-white">Admin Access Required</h2>
                <p className="mt-3 text-sm text-slate-300">
                    Connect the administrator wallet to access the verification dashboard.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Restricted</p>
                    <h2 className="mt-1 text-3xl font-semibold text-white">Inspector Dashboard</h2>
                    <p className="mt-3 text-sm text-slate-300">
                        Review pending land registrations. Approve valid applications or reject invalid ones.
                    </p>
                </div>
                <button
                    onClick={fetchPendingLands}
                    disabled={loading}
                    className="secondary-btn"
                >
                    {loading ? 'Refreshing...' : 'Refresh List'}
                </button>
            </div>

            {error && (
                <div className="alert-card error mt-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert-card success mt-6">
                    {success}
                </div>
            )}

            {loading && pendingLands.length === 0 ? (
                <div className="mt-8 text-center text-sm text-slate-300">Scanning registry...</div>
            ) : pendingLands.length === 0 ? (
                <div className="alert-card success mt-6">
                    No pending applications. All caught up!
                </div>
            ) : (
                <div className="space-y-4 mt-8">
                    {pendingLands.map((land) => (
                        <div key={land.landId} className="land-card border-l-4 border-l-yellow-500">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-semibold text-white">Application #{land.landId}</h3>
                                        <span className="badge bg-yellow-500/20 text-yellow-200">Pending Review</span>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-300">
                                        {land.location}
                                    </p>
                                    <div className="mt-2 flex gap-4 text-xs text-slate-400">
                                        <span>Area: {land.area} sq.m</span>
                                        <span>Applicant: {formatAddress(land.currentOwner)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(land.landId, 'reject')}
                                        disabled={actionLoading === land.landId}
                                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors text-sm font-medium"
                                    >
                                        {actionLoading === land.landId ? 'Processing...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleAction(land.landId, 'approve')}
                                        disabled={actionLoading === land.landId}
                                        className="px-4 py-2 rounded-lg bg-green-500/20 text-green-200 hover:bg-green-500/30 transition-colors text-sm font-medium"
                                    >
                                        {actionLoading === land.landId ? 'Processing...' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
