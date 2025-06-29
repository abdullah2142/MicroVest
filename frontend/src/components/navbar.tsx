import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Briefcase, MessageSquare, Bell, User as UserIcon, LogOut, Plus, TrendingUp } from 'lucide-react';

// Define TypeScript interfaces for our data structures
interface Notification {
    id: number;
    message: string;
    read: boolean;
    investorName?: string;
    amount?: number;
    businessName?: string;
    type?: string;
}

const Navbar: React.FC = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Refs for the notification popup and the button that opens it
    const notificationsRef = useRef<HTMLDivElement>(null);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);

    // Mock fetching notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (user.authToken) {
                try {
                    const response = await fetch('http://localhost:8000/api/notifications/', {
                        headers: {
                            'Authorization': `Bearer ${user.authToken}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setNotifications(data);
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        fetchNotifications();
    }, [user.authToken]);

    // Close notifications popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target as Node) &&
                notificationButtonRef.current &&
                !notificationButtonRef.current.contains(event.target as Node)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isNotificationsOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Show loading state while authentication is being determined
    if (user.loading) {
        return (
            <nav className="bg-black text-white shadow-md">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="bg-white p-1.5 rounded-md">
                                <TrendingUp className="h-5 w-5 text-black" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Microvest</span>
                        </Link>
                    </div>
                    <div className="text-gray-400">Loading...</div>
                </div>
            </nav>
        );
    }

    // The loading check is handled by MainLayout, but this is an extra guard.
    if (!user.isAuthenticated) {
        return null;
    }

    const isInvestor = user.userType === 'investor';
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-black text-white shadow-md">
            <div className="container mx-auto px-8 py-5 flex justify-between items-center">
                {/* Left Box - Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-white p-2 rounded-md">
                            <TrendingUp className="h-6 w-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Microvest</span>
                    </Link>
                </div>

                {/* Middle Box - Navigation Links */}
                <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
                    {isInvestor ? (
                         <Link to="/catalogue" className="hover:text-gray-300 transition-colors font-medium">Browse Businesses</Link>
                    ) : (
                        <>
                            <Link to="/my-businesses" className="hover:text-gray-300 transition-colors font-medium">My Businesses</Link>
                            <Link to="/catalogue" className="hover:text-gray-300 transition-colors font-medium">Browse Businesses</Link>
                        </>
                    )}
                    <Link to="/profit-distributions" className="hover:text-gray-300 transition-colors font-medium">Profit Distributions</Link>
                    <Link to="/consultants" className="hover:text-gray-300 transition-colors font-medium">Look for Consultants</Link>
                    <Link to="/dashboard" className="hover:text-gray-300 transition-colors font-medium">Dashboard</Link>
                </div>

                {/* Right Box - Actions and User Menu */}
                <div className="flex items-center space-x-6 flex-shrink-0">
                    {isInvestor ? (
                         <button onClick={() => navigate('/add-funds')} className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                            <Plus size={18} />
                            <span>Add Funds</span>
                        </button>
                    ) : (
                        <button onClick={() => navigate('/pitch')} className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                            <Plus size={18} />
                            <span>Pitch Idea</span>
                        </button>
                    )}
                   
                    <Link to="/messages" className="relative p-2.5 rounded-full hover:bg-gray-800 transition-colors">
                        <MessageSquare size={22} />
                    </Link>
                    
                    {/* Notifications Area */}
                    <div className="relative">
                        <button
                            ref={notificationButtonRef}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2.5 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            <Bell size={22} />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
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
                                                {notification.message ? (
                                                    notification.message
                                                ) : (
                                                    <>
                                                        <span className="font-bold">{notification.investorName}</span> invested <span className="font-bold">${notification.amount}</span> in your business <span className="font-bold">{notification.businessName}</span>.
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-gray-500">No new notifications</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <Link to="/profile" className="p-2.5 rounded-full hover:bg-gray-800 transition-colors">
                        <UserIcon size={22} />
                    </Link>

                    <button onClick={handleLogout} title="Logout" className="p-2.5 rounded-full hover:bg-gray-800 transition-colors">
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
