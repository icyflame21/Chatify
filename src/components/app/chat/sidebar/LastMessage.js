import React from 'react';

const LastMessage = ({ lastMessage }) => {
  const lastMassagePreview = lastMessage?.message.split('<br>');

  if (lastMessage) {
    return (
      <div
        className="chat-contact-content"
        dangerouslySetInnerHTML={{
          __html: `${name[0]}: ${lastMassagePreview}`
        }}
      />
    );
  }

};


export default LastMessage;
