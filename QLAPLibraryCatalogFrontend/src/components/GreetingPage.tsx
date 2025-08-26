import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * GreetingPage Component
 * 
 * Displays a welcome message with user information
 * and provides logout functionality
 */
export function GreetingPage() {
  // Access auth context using our custom hook
  const { username, userID, email, logout } = useAuth();

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back!
        </h2>
        <div className="text-gray-600">
          <p className="mb-1">
            <span className="font-semibold">Username:</span> {username}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p className="mb-4">
            <span className="font-semibold">User ID:</span> {userID}
          </p>
        </div>
      </div>
      
      {/* User actions */}
      <div className="space-y-3">
        <div className="text-gray-700 text-sm text-center mb-4">
          You are successfully logged in to your account.
        </div>
        
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default GreetingPage;