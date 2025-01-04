import { useContext, useState, useEffect, useRef } from 'react';
import SidebarContext from 'context/SidebarContext';
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from 'icons';
import { Avatar, Badge, Input, WindmillContext } from '@roketid/windmill-react-ui';
import { useRouter } from 'next/navigation';
import { useAuth } from 'hooks/auth/auth-store';
import { useUser } from 'context/UserContext';

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const { logout } = useAuth();
  const { user } = useUser();

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Refs for dropdown menus
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  // Function to handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-end h-full px-6 mx-auto text-red-600 dark:text-purple-300">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>


        {/* Right Menu */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li>
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>

          {/* Profile Menu */}
          <li className="relative" ref={profileMenuRef}>
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src="https://github.com/shadcn.png"
                alt=""
                aria-hidden="true"
              />
              <span className='ml-2 font-bold'><span className='font-light'>Hi</span>, {user?.username || "NA"}</span>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-48 dark:bg-gray-800">
                {/* <button className="flex items-center px-4 py-2 text-sm">
                  <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  Profile
                </button> */}
                <button
                  className="flex items-center px-4 py-2 text-sm text-red-500"
                  onClick={handleLogout}
                >
                  <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  Log out
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
