import React from 'react';
import { formatAddress } from '../utils/contract';

/**
 * Navigation bar component
 */
function Navbar({ account, onDisconnect }) {
  return (
    <header className="mx-auto w-full max-w-6xl">
      <nav className="relative z-20 flex items-center justify-between rounded-[30px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-2xl shadow-[0_18px_45px_rgba(8,47,73,0.45)]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-cyan-400/40 via-sky-500/30 to-violet-500/35 text-white shadow-[0_12px_25px_rgba(56,189,248,0.35)]">
            <span className="text-lg font-semibold tracking-tight">LΞ</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Blockchain Project</p>
            <h1 className="text-xl font-semibold text-white">Land Registry Management</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {account ? (
            <>
              <span className="status-badge">
                <span className="status-dot" />
                {formatAddress(account)}
              </span>
              <button
                onClick={onDisconnect}
                className="secondary-btn"
              >
                Disconnect
              </button>
            </>
          ) : (
            <span className="status-badge">
              <span className="inline-flex h-2 w-2 rounded-full bg-slate-400" />
              Wallet offline
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

