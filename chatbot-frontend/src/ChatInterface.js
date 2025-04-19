import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import Message from './Message';
import './ChatInterface.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // !!! IMPORTANT: Replace with your actual backend URL !!!
      const response = await fetch('https://chatbot-backend-g1sb.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        id: Date.now().toString() + 1,
        content: data.response || "Sorry, I couldn't generate a response.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now().toString() + 1,
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
          <h1>AI Chat Assistant</h1>
          <p>Chat with AI assistant.</p>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isGenerating && (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <span>Generating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isGenerating}
          />
          <button 
            type="submit" 
            disabled={isGenerating || input.trim() === ''}
          >
            <FiSend />
            <span>Send</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default ChatInterface;