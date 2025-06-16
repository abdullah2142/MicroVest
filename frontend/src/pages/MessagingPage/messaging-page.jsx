import { useState } from "react"
import ConversationList from "./ConversationList"
import ChatArea from './ChatArea'
import Header from "../../components/Header2"


export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userType, setUserType] = useState("investor") // This would come from auth context

  // Dummy data - replace with API calls
  const [conversations, setConversations] = useState(
    [
      {
        id: 1,
        name: "TechStart Solutions",
        type: "entrepreneur",
        lastMessage: "Thank you for your interest in our startup!",
        timestamp: "2024-01-15T10:30:00Z",
        unread: 2,
        avatar: "TS",
        online: true,
      },
      {
        id: 2,
        name: "Sarah Ahmed",
        type: "investor",
        lastMessage: "I'd like to discuss the investment terms",
        timestamp: "2024-01-15T09:15:00Z",
        unread: 0,
        avatar: "SA",
        online: false,
      },
      {
        id: 3,
        name: "AI Assistant",
        type: "ai",
        lastMessage: "I can help you with your business queries",
        timestamp: "2024-01-14T16:45:00Z",
        unread: 1,
        avatar: "AI",
        online: true,
      },
      {
        id: 4,
        name: "John Smith",
        type: "consultant",
        lastMessage: "Let's schedule a consultation call",
        timestamp: "2024-01-14T14:20:00Z",
        unread: 0,
        avatar: "JS",
        online: false,
      },
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  )

  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        senderId: 1,
        senderName: "TechStart Solutions",
        content:
          "Hello! Thank you for showing interest in our startup. We're excited to discuss potential investment opportunities.",
        timestamp: "2024-01-15T10:00:00Z",
        type: "text",
      },
      {
        id: 2,
        senderId: "current_user",
        senderName: "You",
        content:
          "Hi! I've reviewed your business plan and I'm impressed with your growth projections. Can you tell me more about your revenue model?",
        timestamp: "2024-01-15T10:15:00Z",
        type: "text",
      },
      {
        id: 3,
        senderId: 1,
        senderName: "TechStart Solutions",
        content:
          "Our primary revenue streams include SaaS subscriptions (70%), enterprise licensing (25%), and consulting services (5%). We've achieved 150% growth year-over-year.",
        timestamp: "2024-01-15T10:25:00Z",
        type: "text",
      },
      {
        id: 4,
        senderId: 1,
        senderName: "TechStart Solutions",
        content: "Thank you for your interest in our startup!",
        timestamp: "2024-01-15T10:30:00Z",
        type: "text",
      },
    ],
  })

  const handleChatSelect = (conversation) => {
    setSelectedChat(conversation)
    // Mark messages as read
    setConversations((prev) => prev.map((conv) => (conv.id === conversation.id ? { ...conv, unread: 0 } : conv)))
    // TODO: Mark messages as read in backend
    // markMessagesAsRead(conversation.id);
  }

  const handleSendMessage = (messageContent) => {
    if (!messageContent.trim() || !selectedChat) return

    const newMsg = {
      id: Date.now(),
      senderId: "current_user",
      senderName: "You",
      content: messageContent.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }))

    // Update last message and move conversation to top
    setConversations((prev) => {
      const updatedConversations = prev.map((conv) =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: messageContent.trim(), timestamp: new Date().toISOString() }
          : conv,
      )

      // Sort conversations by timestamp (most recent first)
      return updatedConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    })

    // TODO: Send message to backend
    // sendMessageToAPI(selectedChat.id, newMsg);
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <style>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
          background-color: white;
          color: black;
          height: 100vh;
          overflow: hidden;
        }

        /* Main Container */
        .messaging-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: white;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        /* Main Content */
        .messaging-content {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
          height: calc(100vh - 64px); /* Subtract header height */
        }

        /* Sidebar */
        .sidebar {
          width: 320px;
          background-color: #f9fafb;
          border-right: 2px solid black;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100%;
          overflow: hidden;
        }

        /* Chat Area */
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: white;
          height: 100%;
          overflow: hidden;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          background-color: #f9fafb;
          height: calc(100% - 120px); /* Adjust based on header and input height */
        }

        /* Header */
        .messaging-header {
          background-color: black;
          color: white;
          padding: 1rem 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          flex-shrink: 0;
        }

        /* Header Layout Updates */
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* Logo Section - Leftmost */
        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
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
        }

        .header-icon-button:hover {
          background-color: #374151;
        }

        .header-icon-button.active {
          background-color: #374151;
          border-color: white;
        }

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
        }

        /* Dropdown Containers */
        .notification-container,
        .profile-container {
          position: relative;
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
          z-index: 50;
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

        /* Profile Dropdown */
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
          z-index: 50;
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

        /* Sidebar */
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
        }

        .sidebar-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: black;
        }

        .new-message-btn {
          background-color: black;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .new-message-btn:hover {
          background-color: #374151;
        }

        /* Search */
        .search-container {
          padding: 1rem 1.5rem;
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          height: 1rem;
          width: 1rem;
          color: #6b7280;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 2px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: black;
        }

        /* Conversations List */
        .conversations-list {
          flex: 1;
          overflow-y: auto;
          background-color: #f9fafb;
        }

        .conversation-item {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background-color 0.2s ease;
          background-color: white;
          margin-bottom: 1px;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .conversation-item:hover {
          background-color: #f3f4f6;
        }

        .conversation-item.active {
          background-color: black;
          color: white;
        }

        .conversation-item.active .conversation-name,
        .conversation-item.active .last-message,
        .conversation-item.active .conversation-time {
          color: white;
        }

        .conversation-item.active .user-type-badge,
        .conversation-item.active .industry-tag,
        .conversation-item.active .portfolio-tag {
          background-color: #374151;
          color: white;
        }

        .conversation-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-circle {
          width: 3rem;
          height: 3rem;
          background-color: #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
          color: #374151;
        }

        .conversation-item.active .avatar-circle {
          background-color: white;
          color: black;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          background-color: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .conversation-content {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .conversation-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: black;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .conversation-time {
          font-size: 0.75rem;
          color: #6b7280;
          flex-shrink: 0;
        }

        .conversation-preview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .last-message {
          font-size: 0.875rem;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .unread-badge {
          background-color: black;
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          min-width: 1.25rem;
          text-align: center;
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .conversation-meta {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .user-type-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          background-color: #f3f4f6;
          color: #374151;
          font-weight: 500;
          display: inline-block;
          margin-top: 0.25rem;
        }

        .conversation-item.active .user-type-badge {
          background-color: #374151;
          color: white;
        }

        /* Remove unused tag styles */
        .industry-tag,
        .portfolio-tag {
          display: none;
        }

        /* Chat Area */
        .chat-header {
          padding: 1rem 1.5rem;
          border-bottom: 2px solid black;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          flex-shrink: 0;
        }

        .chat-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chat-avatar {
          position: relative;
        }

        .chat-user-details h3 {
          font-size: 1rem;
          font-weight: 600;
          color: black;
          margin-bottom: 0.125rem;
        }

        .chat-user-status {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .chat-action-btn {
          background: none;
          border: 2px solid #d1d5db;
          color: #6b7280;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chat-action-btn:hover {
          border-color: black;
          color: black;
        }

        /* Messages */
        .messages-list {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          max-width: 70%;
        }

        .message.sent {
          align-self: flex-end;
          justify-content: flex-end;
        }

        .message.received {
          align-self: flex-start;
          justify-content: flex-start;
        }

        .message-content {
          background-color: white;
          border: 2px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          position: relative;
        }

        .message.sent .message-content {
          background-color: black;
          color: white;
          border-color: black;
        }

        .message-text {
          font-size: 0.875rem;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        /* Message Input */
        .message-input-container {
          padding: 1rem 1.5rem;
          border-top: 2px solid black;
          background-color: white;
          flex-shrink: 0;
        }

        .message-form {
          width: 100%;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #f9fafb;
          border: 2px solid #d1d5db;
          border-radius: 1.5rem;
          padding: 0.5rem;
          transition: border-color 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: black;
        }

        .attachment-btn {
          background: none;
          border: none;
          color: #6b7280;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }

        .attachment-btn:hover {
          color: black;
        }

        .message-input {
          flex: 1;
          border: none;
          background: none;
          padding: 0.5rem;
          font-size: 0.875rem;
          outline: none;
        }

        .send-btn {
          background-color: black;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s ease;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          background-color: #374151;
        }

        .send-btn:disabled {
          background-color: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
        }

        /* No Chat Selected */
        .no-chat-selected {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
        }

        .no-chat-content {
          text-align: center;
          max-width: 300px;
        }

        .no-chat-icon {
          margin-bottom: 1rem;
        }

        .large-icon {
          height: 4rem;
          width: 4rem;
          color: #d1d5db;
        }

        .no-chat-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: black;
          margin-bottom: 0.5rem;
        }

        .no-chat-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.4;
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

          .sidebar {
            width: 100%;
            position: absolute;
            z-index: 10;
            height: 100%;
          }

          .chat-area {
            width: 100%;
          }

          .messaging-content {
            position: relative;
          }

          .conversation-item {
            padding: 0.75rem 1rem;
          }

          .avatar-circle {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 0.75rem;
          }

          .message {
            max-width: 85%;
          }

          .header-content {
            padding: 0;
          }

          .messaging-header {
            padding: 0.75rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .messaging-header {
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

        /* Scrollbar Styling */
        .conversations-list::-webkit-scrollbar,
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .conversations-list::-webkit-scrollbar-track,
        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .conversations-list::-webkit-scrollbar-thumb,
        .messages-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .conversations-list::-webkit-scrollbar-thumb:hover,
        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <div className="messaging-container">
        <Header />

        <div className="messaging-content">
          <ConversationList
            conversations={filteredConversations}
            selectedChat={selectedChat}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onChatSelect={handleChatSelect}
          />

          <ChatArea
            selectedChat={selectedChat}
            messages={messages[selectedChat?.id] || []}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </>
  )
}
