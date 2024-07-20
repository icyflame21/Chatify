import React, { useContext } from 'react';
import { Tab } from 'react-bootstrap';
import ChatContentHeader from './ChatContentHeader';
// import ChatContentBody from './ChatContentBody';
import MessageTextArea from './MessageTextArea';
import { ChatContext } from 'context/ChatProvider';

const ChatContent = () => {
  const { chatHistory } = useContext(ChatContext);

  return (
    <Tab.Content className="card-chat-content">
      {chatHistory?.data?.map((thread, index) => (
        <Tab.Pane key={index} eventKey={index} className="card-chat-pane">
          <ChatContentHeader thread={thread} />
          {/* <ChatContentBody thread={thread} /> */}
        </Tab.Pane>
      ))}
      <MessageTextArea />
    </Tab.Content>
  );
};
export default ChatContent;
