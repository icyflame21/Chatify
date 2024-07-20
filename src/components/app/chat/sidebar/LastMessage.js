import React from 'react';

const LastMessage = ({ lastMessage }) => {
  if (lastMessage) {
    const lastMassagePreview = lastMessage?.message.split('<br>');
    return (
      <div
        className="chat-contact-content"
      >
        {`${lastMessage?.createdBy}: ${lastMassagePreview}`}
      </div>
    );
  }

};

export default LastMessage;
