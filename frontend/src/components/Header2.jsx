"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Dummy notifications data - replace with API
  const notifications = [
    {
      id: 1,
      type: "investment",
      title: "New Investment Opportunity",
      message: "TechStart Solutions is seeking ৳50,00,000 funding",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Sarah Ahmed sent you a message",
      timestamp: "2024-01-15T09:15:00Z",
      read: false,
    },
    {
      id: 3,
      type: "update",
      title: "Portfolio Update",
      message: "GreenEnergy Ventures Q4 report is available",
      timestamp: "2024-01-14T16:45:00Z",
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    setShowProfileMenu(false)
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
    setShowNotifications(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <>
      <style>{`
        /* Header Styles */
        .header {
          background-color: black;
          color: white;
          padding: 1rem 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          width: 100%;
          position: relative;
          z-index: 1000; /* Ensure header is above other content */
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          position: relative; /* For proper dropdown positioning */
        }

        /* Logo Section */
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          position: relative;
          z-index: 1001; /* Above other header elements */
        }

        .logo-icon {
          background-color: white;
          border-radius: 0.375rem;
          padding: 0.5rem;
        }

        .trending-icon {
          height: 1.5rem;
          width: 1.5rem;
          color: black;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        /* Center Navigation */
        .center-nav {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex: 1;
          justify-content: center;
          position: relative;
          z-index: 1001;
        }

        .nav-button {
          background: none;
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1001;
        }

        .nav-button:hover {
          background-color: #374151;
        }

        /* Right Actions */
        .right-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1001;
        }

        .pitch-button {
          background-color: white;
          color: black;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1001;
        }

        .pitch-button:hover {
          background-color: #f3f4f6;
          transform: translateY(-1px);
        }

        .header-icon-button {
          background: none;
          border: 1px solid #374151;
          color: white;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1001;
        }

        .header-icon-button:hover {
          background-color: #374151;
        }

        .header-icon-button.active {
          background-color: #374151;
          border-color: white;
        }

        .icon {
          height: 1.25rem;
          width: 1.25rem;
        }

        /* Notification Badge */
        .notification-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background-color: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          min-width: 1.25rem;
          text-align: center;
          z-index: 1002;
        }

        /* Dropdown Containers */
        .notification-container,
        .profile-container {
          position: relative;
          z-index: 1002;
        }

        /* Notifications Dropdown */
        .notifications-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background-color: white;
          border: 2px solid black;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          width: 320px;
          max-height: 400px;
          overflow: hidden;
          z-index: 1002;
        }

        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f9fafb;
        }

        .dropdown-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: black;
          margin: 0;
        }

        .mark-all-read {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
        }

        .mark-all-read:hover {
          color: black;
        }

        .notifications-list {
          max-height: 280px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          gap: 0.75rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .notification-item:hover {
          background-color: #f9fafb;
        }

        .notification-item.unread {
          background-color: #f0f9ff;
          border-left: 3px solid black;
        }

        .notification-icon {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          background-color: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-item.unread .notification-icon {
          background-color: black;
          color: white;
        }

        .small-icon {
          height: 1rem;
          width: 1rem;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: black;
          margin: 0 0 0.25rem 0;
        }

        .notification-message {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.625rem;
          color: #9ca3af;
        }

        .dropdown-footer {
          padding: 0.75rem 1rem;
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }

        .view-all-button {
          width: 100%;
          background: none;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .view-all-button:hover {
          border-color: black;
          color: black;
        }

        /* Profile Button and Dropdown */
        .profile-button {
          background: none;
          border: 1px solid #374151;
          color: white;
          padding: 0.25rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1001;
        }

        .profile-button:hover {
          background-color: #374151;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background-color: white;
          border: 2px solid black;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          width: 180px;
          overflow: hidden;
          z-index: 1002;
        }

        .dropdown-item {
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          transition: background-color 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: #f9fafb;
        }

        .dropdown-item.logout {
          color: #ef4444;
          border-top: 1px solid #f3f4f6;
        }

        .dropdown-item.logout:hover {
          background-color: #fef2f2;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .center-nav {
            gap: 0.5rem;
          }

          .nav-button {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 768px) {
          .center-nav {
            display: none;
          }

          .notifications-dropdown {
            width: 280px;
            right: -50px;
          }

          .profile-dropdown {
            right: -20px;
          }

          .pitch-button {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }

          .pitch-button .icon {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 0.5rem 1rem;
          }

          .right-actions {
            gap: 0.5rem;
          }

          .pitch-button {
            padding: 0.25rem 0.5rem;
          }

          .notifications-dropdown {
            width: 260px;
            right: -80px;
          }
        }
      `}</style>
      <div className="header">
        <div className="header-content">
          {/* Logo Section - Leftmost */}
          <div className="logo-section">
            <div className="logo-icon">
              <svg className="trending-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="brand-title">MicroVest</h1>
          </div>

          {/* Center Navigation */}
          <div className="center-nav">
            <button className="nav-button" onClick={() => handleNavigation("/catalogue")}>
              Browse Businesses
            </button>
            <button className="nav-button" onClick={() => handleNavigation("/consultant")}>
              Look for Consultants
            </button>
            <button className="nav-button" onClick={() => handleNavigation("/investor-dashboard")}>
              Dashboard
            </button>
          </div>

          {/* Right Actions */}
          <div className="right-actions">
            {/* Pitch Idea Button */}
            <button className="pitch-button" onClick={() => handleNavigation("/business-pitch")}>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Pitch Idea
            </button>

            {/* Messages Icon */}
            <button className="header-icon-button active" onClick={() => handleNavigation("/messaging")}>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            {/* Notifications - Bell Icon */}
            <div className="notification-container">
              <button className="header-icon-button" onClick={handleNotificationClick}>
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {/* Bell body */}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.5 17.5a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5c0-1.5.5-3 2-4.5V9a4 4 0 0 1 8 0v4c1.5 1.5 2 3 2 4.5Z"
                  />
                  {/* Bell clapper */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21h3" />
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read">Mark all as read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`notification-item ${!notification.read ? "unread" : ""}`}>
                        <div className="notification-icon">
                          {notification.type === "investment" && (
                            <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          )}
                          {notification.type === "message" && (
                            <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          )}
                          {notification.type === "update" && (
                            <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="notification-content">
                          <h4 className="notification-title">{notification.title}</h4>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{formatNotificationTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button className="view-all-button">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="profile-container">
              <button className="profile-button" onClick={handleProfileClick}>
                <div className="profile-avatar">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={() => handleNavigation("/entrepreneur-dashboard")}>
                    <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </button>
                  <button className="dropdown-item logout" onClick={() => handleNavigation("/")}>
                    <svg className="small-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
