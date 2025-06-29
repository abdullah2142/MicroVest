import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

// Define TypeScript interfaces for our data structures
interface Notification {
  id: number;
  type: 'investment';
  investorName: string;
  amount: number;
  businessName: string;
  read: boolean;
}

const Header2: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  // Refs for the notification popup and the button that opens it
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  // Debug function to check if notifications are working
  const toggleNotifications = () => {
    console.log('Toggle notifications clicked, current state:', isNotificationsOpen);
    setIsNotificationsOpen(!isNotificationsOpen);
    console.log('New state will be:', !isNotificationsOpen);
  };

  // Mock fetching notifications
  useEffect(() => {
    const fetchNotifications = () => {
      // In a real app, you would fetch this from your API
      const mockNotifications: Notification[] = [
        { id: 1, type: 'investment', investorName: 'John Doe', amount: 500, businessName: 'Eco-Friendly Eats', read: false },
        { id: 2, type: 'investment', investorName: 'Jane Smith', amount: 1200, businessName: 'Tech Innovators Inc.', read: true },
        { id: 3, type: 'investment', investorName: 'Sam Wilson', amount: 750, businessName: 'GreenScape Solutions', read: false },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('prof_pic');

    navigate('/login');
  };

  // Close notifications popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside the popup and not on the button, close the popup.
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    // Add listener only when the popup is open
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the listener when the component unmounts or the popup closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]); // Re-run effect if isNotificationsOpen changes


  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('authToken') && localStorage.getItem('username');
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/catalogue" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold">MicroVest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/catalogue" className="hover:text-gray-300 transition-colors">
              Browse Investments
            </Link>
            <Link to="/pitch" className="hover:text-gray-300 transition-colors">
              Submit Pitch
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-gray-300 transition-colors">
                  Profile
                </Link>

                {/* Notifications Area */}
                <div className="relative">
                   {/* Notifications Icon Button */}
                  <button
                    ref={notificationButtonRef}
                    onClick={toggleNotifications}
                    className="relative p-2 hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popup */}
                  {isNotificationsOpen && (
                    <div 
                      ref={notificationsRef} 
                      className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                      style={{ top: '100%' }}
                    >
                      <div className="p-4 font-bold border-b border-gray-200 bg-gray-50">Notifications</div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(notification => (
                           <div key={notification.id} className={`p-4 border-b border-gray-100 text-sm hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                             <p>
                               <span className="font-bold">{notification.investorName}</span> invested <span className="font-bold">${notification.amount}</span> in your business <span className="font-bold">{notification.businessName}</span>.
                             </p>
                           </div>
                        )) : (
                          <div className="p-4 text-center text-gray-500">No new notifications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link to="/catalogue" className="hover:text-gray-300 transition-colors">
                Browse Investments
              </Link>
              <Link to="/pitch" className="hover:text-gray-300 transition-colors">
                Submit Pitch
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:text-gray-300 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="hover:text-gray-300 transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-300 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header2;
