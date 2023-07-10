// ChatInterface.js

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const ChatInterface = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }, [chatHistory]);

  const handleSignIn = () => {
    // Implement your authentication logic here
    // Set the authenticated user
    setUser({ name: 'John Doe', id: 'user123' });
  };

  const handleSignOut = () => {
    // Implement your sign out logic here
    // Clear the authenticated user
    setUser(null);
    // Clear the chat history
    setChatHistory([]);
  };

  const sendMessage = async () => {
    try {
      setIsLoading(true);
      const timestamp = Date.now();
      const response = await axios.post('/chatbot', {
        user: user ? user.id : null,
        message: userMessage,
      });
      const botResponse = response.data.message;
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { userMessage, botResponse, timestamp },
      ]);
      setUserMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((entry, index) => (
              <div key={index}>
                <div className="chat-timestamp">
                  {formatTimestamp(entry.timestamp)}
                </div>
                <div>{entry.userMessage}</div>
                <div>{entry.botResponse}</div>
              </div>
            ))}
          </div>
          <div className="chat-actions">
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>Please sign in to start the chat.</div>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
