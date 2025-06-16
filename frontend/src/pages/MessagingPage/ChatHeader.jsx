"use client"

export default function ChatHeader({ selectedChat }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getUserTypeBadge = (type) => {
    switch (type) {
      case "investor":
        return "💼 Investor"
      case "entrepreneur":
        return "🚀 Entrepreneur"
      case "consultant":
        return "👨‍💼 Consultant"
      case "ai":
        return "🤖 AI Assistant"
      default:
        return "👤 User"
    }
  }

  return (
    <div className="chat-header">
      <div className="chat-user-info">
        <div className="chat-avatar">
          <div className="avatar-circle">{selectedChat.avatar}</div>
          {selectedChat.online && <div className="online-indicator"></div>}
        </div>
        <div className="chat-user-details">
          <h3 className="chat-user-name">{selectedChat.name}</h3>
          <p className="chat-user-status">
            {selectedChat.online ? "Online" : `Last seen ${formatTime(selectedChat.timestamp)}`}
          </p>
        </div>
      </div>
      <div className="chat-actions">
        <span className="user-type-badge">{getUserTypeBadge(selectedChat.type)}</span>
        {selectedChat.industry && <span className="industry-tag">{selectedChat.industry}</span>}
        {selectedChat.portfolio && <span className="portfolio-tag">{selectedChat.portfolio}</span>}
      </div>
    </div>
  )
}
