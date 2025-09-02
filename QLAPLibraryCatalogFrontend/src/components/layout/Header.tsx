import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BookOpen, Home, Book, FolderOpen, LogOut, LogIn, UserPlus } from "lucide-react";

/**
 * Header Component
 * 
 * Displays a welcome message with user information
 * and provides logout functionality
 */
export function Header() {
  const { username, logout, isLoggedIn } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-charcoal text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand - Far Left */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-8 w-8 text-lavender-400" />
            <div>
              <h1 className="text-xl font-bold text-white">QLAP</h1>
            </div>
          </Link>

          {/* Navigation - Center (for authenticated users) */}
          {isLoggedIn && (
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' 
                    ? 'bg-lavender-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Link>
              <Link
                to="/network-catalog"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/network-catalog' 
                    ? 'bg-lavender-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <Book size={18} className="mr-2" />
                Browse Books
              </Link>
              <Link
                to="/my-library"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/my-library' 
                    ? 'bg-lavender-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <FolderOpen size={18} className="mr-2" />
                My Library
              </Link>
            </nav>
          )}

          {/* Auth Buttons - Far Right */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <span className="text-gray-300 text-sm">
                  Welcome, {username}!
                </span>
                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 bg-white text-charcoal rounded-md 
                           hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 border border-white text-white rounded-md 
                           hover:bg-white hover:text-charcoal transition-colors font-medium text-sm"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-4 py-2 bg-white text-charcoal rounded-md 
                           hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  <UserPlus size={18} className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;