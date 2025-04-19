import React from 'react';
import './Message.css';

function Message({ message }) {
  const { role, content } = message;
  
  return (
    <div className={`message ${role === 'user' ? 'user' : 'assistant'}`}>
      <div className="message-content">
        {content}
      </div>
    </div>
  );
}

export default Message;