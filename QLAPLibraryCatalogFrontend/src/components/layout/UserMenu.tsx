// components/shared/HeadlessUserMenu.tsx
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, SquareCheck, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

export function UserMenu() {
  const { username, logout } = useAuth()

  return (
    <Menu as="div" className="relative">
      {/* Menu Button */}
      <MenuButton className="flex items-center px-4 py-2 bg-white text-charcoal rounded-md hover:bg-gray-100 transition-colors font-Media text-sm">
        <User size={18} className="mr-2" />
        {username}
      </MenuButton>

      {/* Menu Items */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 top-12 w-48 bg-white text-charcoal rounded-md shadow-lg py-2 z-50 focus:outline-none">
          
          <MenuItem>
            {({ focus }) => (
              <Link
                to="/user-profile"
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  focus ? 'bg-gray-100' : ''
                }`}
              >
                <User size={16} className="mr-2" />
                Profile
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <Link
                to="/user-preferences"
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  focus ? 'bg-gray-100' : ''
                }`}
              >
                <SquareCheck size={16} className="mr-2" />
                Preferences
              </Link>
            )}
          </MenuItem>

          <MenuItem>
            {({ focus }) => (
              <button
                onClick={logout}
                className={`flex w-full items-center px-4 py-2 text-sm transition-colors ${
                  focus ? 'bg-gray-100' : ''
                }`}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            )}
          </MenuItem>

        </MenuItems>
      </Transition>
    </Menu>
  )
}