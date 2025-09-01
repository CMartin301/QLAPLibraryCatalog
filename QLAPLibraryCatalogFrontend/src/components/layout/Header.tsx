import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <header className="bg-slate-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand - Far Left */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div>
              <span className="text-3xl">🏳️‍🌈</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">QLAP</h1>
            </div>
          </Link>

          {/* Navigation - Center (for authenticated users) */}
          {isLoggedIn && (
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={location.pathname === '/dashboard' ? 'nav-link--active' : 'nav-link'}
              >
                <i className="bi bi-house-door mr-2"></i>
                Dashboard
              </Link>
              <Link
                to="/books"
                className={location.pathname === '/books' ? 'nav-link--active' : 'nav-link'}
              >
                <i className="bi bi-book mr-2"></i>
                Browse Books
              </Link>
              <Link
                to="/my-library"
                className={location.pathname === '/my-library' ? 'nav-link--active' : 'nav-link'}
              >
                <i className="bi bi-collection mr-2"></i>
                My Library
              </Link>
              <Link
                to="/notifications"
                className={location.pathname === '/notifications' ? 'nav-link--active' : 'nav-link'}
              >
                <i className="bi bi-bell mr-2"></i>
                Notifications
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
                  className="btn-primary"
                >
                  <i className="bi bi-box-arrow-right mr-2"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-outline"
                >
                  <i className="bi bi-box-arrow-in-right mr-2"></i>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  <i className="bi bi-person-plus mr-2"></i>
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
// import { Link, useLocation } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";


// /**
//  * Header Component
//  * 
//  * Displays a welcome message with user information
//  * and provides logout functionality
//  */
// export function Header() {
//   // Access auth context using our custom hook
//   const { username, userID, email, logout, isLoggedIn } = useAuth();

//   return (
//     <div className="">
//       <header>

//         <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
//           {/* Logo and Brand - Far Left */}
//           <Link to={"/dashboard"} className="navbar-brand d-flex align-items-center">
//             <div className="me-2">
//               <span className="fs-3">🏳️‍🌈</span>
//             </div>
//             <div>
//               <h1 className="mb-0 fs-4 fw-bold text-white">QLAP</h1>
//             </div>
//           </Link>
//         </div>


//           {/* Navigation - Center (for authenticated users on non-public pages) */}
//           {isLoggedIn  && (
//             <div className="d-none d-lg-flex navbar-nav mx-auto">
//               <Link
//                 to="/dashboard"
//                 className={`nav-link px-3 ${location.pathname === '/dashboard' ? 'active' : ''}`}
//               >
//                 <i className="bi bi-house-door me-2"></i>
//                 Dashboard
//               </Link>
//               <Link
//                 to="/books"
//                 className={`nav-link px-3 ${location.pathname === '/books' ? 'active' : ''}`}
//               >
//                 <i className="bi bi-book me-2"></i>
//                 Browse Books
//               </Link>
//               <Link
//                 to="/my-library"
//                 className={`nav-link px-3 ${location.pathname === '/my-library' ? 'active' : ''}`}
//               >
//                 <i className="bi bi-collection me-2"></i>
//                 My Library
//               </Link>
//               <Link
//                 to="/notifications"
//                 className={`nav-link px-3 ${location.pathname === '/notifications' ? 'active' : ''}`}
//               >
//                 <i className="bi bi-bell me-2"></i>
//                 Notifications
//               </Link>
//             </div>
//           )}

//           {/* Auth Buttons - Far Right */}
//           <div className="d-none d-lg-flex gap-2 ms-auto">
//             {isLoggedIn ? (
//               <>
//                 {/* {isPublicPage && (
//                   <Link
//                     to="/dashboard"
//                     className="btn btn-outline-light px-3"
//                   >
//                     <i className="bi bi-speedometer2 me-2"></i>
//                     Go to Your Catalog
//                   </Link>
//                 )} */}
//                 {isLoggedIn && (
//                   <span className="navbar-text text-white me-3">
//                     Welcome, {username}!
//                   </span>
//                 )}
//                 <button
//                   onClick={logout}
//                   className="btn btn-light text-dark px-3"
//                 >
//                   <i className="bi bi-box-arrow-right me-2"></i>
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="btn btn-outline-light px-3"
//                 >
//                   <i className="bi bi-box-arrow-in-right me-2"></i>
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="btn btn-light text-dark px-3"
//                 >
//                   <i className="bi bi-person-plus me-2"></i>
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>
//       </header>
//     </div>
//   );
// }

// export default Header;