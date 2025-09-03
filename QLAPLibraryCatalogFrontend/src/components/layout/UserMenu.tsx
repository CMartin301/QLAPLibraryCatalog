import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import useAuth from "../../hooks/useAuth";

export function UserMenu() {
  const { username, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        className="flex items-center px-4 py-2 bg-white text-charcoal rounded-md 
                   hover:bg-gray-100 transition-colors font-Media text-sm"
      >
        <User size={18} className="mr-2" />
        {username}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id="user-menu"
          role="menu"
          className="absolute right-0 top-12 w-48 bg-white text-charcoal rounded-md 
                     shadow-lg py-2 z-50"
        >
          <Link
            to="/preferences"
            role="menuitem"
            tabIndex={0}
            className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm"
          >
            <User size={16} className="mr-2" />
            Preferences
          </Link>
          <button
            onClick={logout}
            role="menuitem"
            tabIndex={0}
            className="flex w-full items-center px-4 py-2 hover:bg-gray-100 text-sm"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
