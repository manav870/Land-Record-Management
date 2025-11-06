import React from 'react';
import { formatAddress } from '../utils/contract';

/**
 * Navigation bar component
 */
function Navbar({ account, onDisconnect }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">
              Land Registry
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {account ? (
              <>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <span className="font-semibold">Connected:</span>{' '}
                  {formatAddress(account)}
                </div>
                <button
                  onClick={onDisconnect}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="text-gray-500">Not Connected</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

