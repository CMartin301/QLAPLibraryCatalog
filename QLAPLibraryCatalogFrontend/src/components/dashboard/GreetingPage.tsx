import useAuth from "../../hooks/useAuth";



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

    <div className="login-container">
      <div className="row justify-content-center">
        {/* Header Section - Shows on both pages */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <h1 className="display-4 fw-bold mb-3" style={{color: 'var(--primary-lavender)', fontFamily: 'Georgia, "Times New Roman", serif'}}>
              Welcome back, {username}
            </h1>
            <div className="accent-stripes mx-auto mt-3"></div>
          </div>
        </div>

    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Account Information
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

      </div>
    </div>

  );
}

export default GreetingPage;