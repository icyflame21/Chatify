import React from 'react';

const LastMessage = ({ lastMessage }) => {
  if (lastMessage) {
    const lastMassagePreview = lastMessage?.message.split('<br>');
    return (
      <div
        className="chat-contact-content"
      >
        {`${lastMessage?.createdBy}: ${lastMassagePreview[0]}`}
      </div>
    );
  }

};

export default LastMessage;
