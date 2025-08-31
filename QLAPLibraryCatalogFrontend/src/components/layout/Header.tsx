import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


/**
 * Header Component
 * 
 * Displays a welcome message with user information
 * and provides logout functionality
 */
export function Header() {
  // Access auth context using our custom hook
  const { username, userID, email, logout, isLoggedIn } = useAuth();

  return (
    <div className="">
      <header className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#495057' }}>

        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          {/* Logo and Brand - Far Left */}
          <Link to={"/dashboard"} className="navbar-brand d-flex align-items-center">
            <div className="me-2">
              <span className="fs-3">🏳️‍🌈</span>
            </div>
            <div>
              <h1 className="mb-0 fs-4 fw-bold text-white">QLAP</h1>
            </div>
          </Link>
        </div>


          {/* Navigation - Center (for authenticated users on non-public pages) */}
          {isLoggedIn  && (
            <div className="d-none d-lg-flex navbar-nav mx-auto">
              <Link
                to="/dashboard"
                className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                <i className="bi bi-house-door me-2"></i>
                Dashboard
              </Link>
              <Link
                to="/books"
                className={`nav-link px-3 ${location.pathname === '/books' ? 'active' : ''}`}
              >
                <i className="bi bi-book me-2"></i>
                Browse Books
              </Link>
              <Link
                to="/my-books"
                className={`nav-link px-3 ${location.pathname === '/mylibrary' ? 'active' : ''}`}
              >
                <i className="bi bi-collection me-2"></i>
                My Library
              </Link>
              <Link
                to="/notifications"
                className={`nav-link px-3 ${location.pathname === '/notifications' ? 'active' : ''}`}
              >
                <i className="bi bi-bell me-2"></i>
                Notifications
              </Link>
            </div>
          )}

          {/* Auth Buttons - Far Right */}
          <div className="d-none d-lg-flex gap-2 ms-auto">
            {isLoggedIn ? (
              <>
                {/* {isPublicPage && (
                  <Link
                    to="/dashboard"
                    className="btn btn-outline-light px-3"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Go to Your Catalog
                  </Link>
                )} */}
                {isLoggedIn && (
                  <span className="navbar-text text-white me-3">
                    Welcome, {username}!
                  </span>
                )}
                <button
                  onClick={logout}
                  className="btn btn-light text-dark px-3"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light px-3"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-light text-dark px-3"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Link>
              </>
            )}
          </div>
      </header>
    </div>
  );
}

export default Header;