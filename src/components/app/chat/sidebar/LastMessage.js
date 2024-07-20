import React from 'react';

const LastMessage = ({ lastMessage }) => {
  if (lastMessage) {
    const lastMassagePreview = lastMessage?.message.split('<br>');
    return (
      <div
        className="chat-contact-content"
        dangerouslySetInnerHTML={{
          __html: `${lastMessage?.createdBy}: ${lastMassagePreview}`
        }}
      />
    );
  }

};

export default LastMessage;
