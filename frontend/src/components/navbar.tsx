import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Briefcase, MessageSquare, Bell, User as UserIcon, LogOut, Plus, TrendingUp } from 'lucide-react';

// Define TypeScript interfaces for our data structures
interface Notification {
    id: number;
    message: string;
    read: boolean;
    created_at: string;
    business_id?: number;
    investorName?: string;
    amount?: number;
    businessName?: string;
    type?: string;
}

const Navbar: React.FC = () => {
    const { user, logout, openAddFundsModal } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [lastUnreadCount, setLastUnreadCount] = useState<number>(0);

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

    // Check for unread messages
    useEffect(() => {
        const checkUnreadMessages = async () => {
            if (user.authToken) {
                try {
                    const response = await fetch('http://localhost:8000/api/messaging/conversations/', {
                        headers: {
                            'Authorization': `Bearer ${user.authToken}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const unreadCount = data.reduce((sum: number, conv: any) => sum + (conv.unread_count || 0), 0);
                        setLastUnreadCount(unreadCount);
                        const lastSeenUnread = parseInt(localStorage.getItem('lastSeenUnreadCount') || '0', 10);
                        setHasUnreadMessages(unreadCount > lastSeenUnread);
                    }
                } catch (error) {
                    // ignore
                }
            }
        };
        checkUnreadMessages();
    }, [user.authToken]);

    useEffect(() => {
        if (location.pathname.startsWith('/messages')) {
            // When visiting the messaging page, update last seen unread count
            localStorage.setItem('lastSeenUnreadCount', lastUnreadCount.toString());
            setHasUnreadMessages(false);
        }
    }, [location.pathname, lastUnreadCount]);

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

    // Helper function to format timestamp
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Show loading state while authentication is being determined
    if (user.loading) {
        return (
            <nav className="fixed top-0 w-full z-50 bg-black text-white shadow-md">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <div className="bg-white p-1.5 rounded-md">
                                <TrendingUp className="h-5 w-5 text-black" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">MicroVest</span>
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
        <nav className="fixed top-0 w-full z-50 bg-black text-white shadow-md">
            <div className="container mx-auto px-8 py-5 flex justify-between items-center">
                {/* Left Box - Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link to="/catalogue" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <div className="bg-white p-2 rounded-md">
                            <TrendingUp className="h-6 w-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">MicroVest</span>
                    </Link>
                </div>

                {/* Middle Box - Navigation Links */}
                <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
                    {isInvestor ? (
                         <>
                           <Link to="/catalogue" className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium">Browse Businesses</Link>
                           <Link to="/my-investments" className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium">My Investments</Link>
                         </>
                    ) : (
                        <>
                            <Link to="/my-businesses" className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium">My Businesses</Link>
                            <Link to="/catalogue" className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium">Browse Businesses</Link>
                        </>
                    )}
                    <Link to="/consultants" className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium">Look for Consultants</Link>
                    <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium">Dashboard</Link>
                </div>

                {/* Right Box - Actions and User Menu */}
                <div className="flex items-center space-x-6 flex-shrink-0">
                    {isInvestor ? (
                         <button onClick={openAddFundsModal} className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-gray-200 hover:shadow-lg transition-all duration-200">
                            <Plus size={18} />
                            <span>Add Funds</span>
                        </button>
                    ) : (
                        <button onClick={() => navigate('/pitch')} className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-gray-200 hover:shadow-lg transition-all duration-200">
                            <Plus size={18} />
                            <span>Pitch Idea</span>
                        </button>
                    )}
                   
                    <Link to="/messages" className="relative p-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200">
                        <MessageSquare size={22} />
                        {hasUnreadMessages && (
                            <span className="absolute top-2 right-2 block h-3 w-3 rounded-full bg-red-500 border-2 border-black"></span>
                        )}
                    </Link>
                    
                    {/* Notifications Area */}
                    <div className="relative">
                        <button
                            ref={notificationButtonRef}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer"
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
                                <div className="p-4 font-bold border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                                    <span>Notifications</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                const token = user.authToken;
                                                try {
                                                    // Mark all as read (not delete)
                                                    const response = await fetch('http://localhost:8000/api/notifications/', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                        },
                                                    });
                                                    if (response.ok) {
                                                        // Mark all as read locally
                                                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                    }
                                                } catch (error) {
                                                    // Optionally show a notification error
                                                }
                                            }}
                                            className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const token = user.authToken;
                                                try {
                                                    const response = await fetch('http://localhost:8000/api/notifications/clear/', {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`,
                                                        },
                                                    });
                                                    if (response.ok) {
                                                        setNotifications([]);
                                                    }
                                                } catch (error) {
                                                    // Optionally show a notification error
                                                }
                                            }}
                                            className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-gray-100 text-sm hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}
                                                ${notification.message && (
                                                    notification.message.includes('sent you a friend request') || 
                                                    notification.message.includes('You are now friends with') ||
                                                    (notification.business_id && user.userType === 'investor' && notification.message.includes('business report log')) ||
                                                    (notification.business_id && user.userType === 'investor' && notification.message.includes('profit distribution')) ||
                                                    (notification.business_id && user.userType === 'entrepreneur' && (notification.message.includes('investment') || notification.message.includes('invested')))
                                                ) ? 'cursor-pointer hover:bg-blue-100' : ''}`}
                                            onClick={() => {
                                                if (notification.message && notification.message.includes('sent you a friend request')) {
                                                    navigate('/messages', { state: { openTab: 'friendRequests' } });
                                                    setIsNotificationsOpen(false);
                                                } else if (notification.message && notification.message.includes('You are now friends with')) {
                                                    // Extract username from message
                                                    const match = notification.message.match(/You are now friends with ([^\.]+)\./);
                                                    if (match && match[1]) {
                                                        // Optionally, you could use a user id if available in the notification
                                                        navigate('/messages', { state: { openChatWith: match[1].trim() } });
                                                        setIsNotificationsOpen(false);
                                                    }
                                                } else if (notification.business_id && user.userType === 'entrepreneur' && 
                                                          (notification.message.includes('investment') || notification.message.includes('invested'))) {
                                                    // Navigate to fund statistics page for entrepreneurs when they receive investment notifications
                                                    navigate(`/business/${notification.business_id}/fund-statistics`);
                                                    setIsNotificationsOpen(false);
                                                } else if (notification.business_id && user.userType === 'investor' && 
                                                          notification.message.includes('business report log')) {
                                                    // Navigate to business logs page for investors when they receive log notifications
                                                    navigate(`/businesses/${notification.business_id}/logs`);
                                                    setIsNotificationsOpen(false);
                                                } else if (notification.business_id && user.userType === 'investor' && 
                                                          notification.message.includes('profit distribution')) {
                                                    // Navigate to business detail page for investors when they receive profit distribution notifications
                                                    navigate(`/business/${notification.business_id}`);
                                                    setIsNotificationsOpen(false);
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
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
                                                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                                    {formatTimestamp(notification.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-gray-500">No new notifications</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <Link to="/profile" className="p-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200">
                        <UserIcon size={22} />
                    </Link>

                    <button onClick={handleLogout} title="Logout" className="p-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200">
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
