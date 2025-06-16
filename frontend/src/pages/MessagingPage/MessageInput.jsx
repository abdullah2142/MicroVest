"use client"

import { useState } from "react"

export default function MessageInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    onSendMessage(newMessage)
    setNewMessage("")
  }

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
