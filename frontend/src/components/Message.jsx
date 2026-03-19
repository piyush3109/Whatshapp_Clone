import React from 'react';

const Message = ({ message, user, isGroupChat }) => {
  const isSelf = message.sender._id === user._id;

  return (
    <div className={`message-box ${isSelf ? 'message-out' : 'message-in'}`}>
      {!isSelf && isGroupChat && (
        <span style={{ fontSize: '12px', color: '#00a884', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>
          {message.sender.name}
        </span>
      )}
      {message.content}
    </div>
  );
};

export default Message;
