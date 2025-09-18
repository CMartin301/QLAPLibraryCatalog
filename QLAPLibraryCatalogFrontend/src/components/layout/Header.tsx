import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BookOpen, Home, Book, FolderOpen, LogIn, UserPlus, Handshake, Tag } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { DropdownItem, HeaderDropdown } from "./HeaderDropdown";

/**
 * Header Component
 */
export function Header() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const browseItems: DropdownItem[] = [
    { label: 'Media', path: '/network-catalog', icon: Book },
    { label: 'Tags', path: '/tags', icon: Tag }
  ];

  return (
    <header className="bg-charcoal text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-8 w-8 text-lavender-200" />
            <h1 className="text-xl font-bold text-white">QLAP</h1>
          </Link>

          {/* Navigation */}
          {isLoggedIn && (
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-Media transition-colors ${
                  location.pathname === '/dashboard' 
                    ? 'text-white border-l-4 border-lavender-400 bg-charcoal-light' 
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Link>
              <HeaderDropdown 
                label="Browse" 
                items={browseItems} 
              />
              {/* <Link
                to="/network-catalog"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-Media transition-colors ${
                  location.pathname === '/network-catalog' 
                    ? 'bg-lavender-500 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <Book size={18} className="mr-2" />
                Browse Books
              </Link> */}
              <Link
                to="/my-library"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-Media transition-colors ${
                  location.pathname === '/my-library' 
                    ? 'text-white border-l-4 border-lavender-400 bg-charcoal-light' 
                    : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <FolderOpen size={18} className="mr-2" />
                My Library
              </Link>
              <Link
                to="/borrowing"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-Media transition-colors ${
                  location.pathname === '/borrowing' 
                  ? 'text-white border-l-4 border-lavender-400 bg-charcoal-light' 
                  : 'text-gray-300 hover:text-white hover:bg-charcoal-light'
                }`}
              >
                <Handshake size={18} className="mr-2" />
                Borrowing
              </Link>
            </nav>
          )}

          {/* Auth Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 border border-white text-white rounded-md 
                           hover:bg-white hover:text-charcoal transition-colors font-Media text-sm"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-4 py-2 bg-white text-charcoal rounded-md 
                           hover:bg-gray-100 transition-colors font-Media text-sm"
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
