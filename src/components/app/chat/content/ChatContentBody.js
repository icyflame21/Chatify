import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatContentBodyIntro from './ChatContentBodyIntro';
import Message from './Message';
import SimpleBarReact from 'simplebar-react';
import ThreadInfo from './ThreadInfo';
import { ChatContext } from 'context/ChatProvider';
import { Col, Row, Spinner } from 'react-bootstrap';

const ChatContentBody = ({ thread }) => {
  const messagesEndRef = useRef();
  const prevChatMessagesRef = useRef();

  const { scrollToBottom, handleScrollToBottom, chatMessages } = useContext(ChatContext);

  useEffect(() => {
    const prevChatMessages = prevChatMessagesRef.current;

    const chatMessagesChanged = JSON.stringify(prevChatMessages) !== JSON.stringify(chatMessages);

    if (scrollToBottom || chatMessagesChanged) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      handleScrollToBottom(false);
    }

    prevChatMessagesRef.current = chatMessages;
  }, [chatMessages, scrollToBottom]);

  return (
    <div className="chat-content-body" style={{ display: 'inherit' }} >
      <ThreadInfo thread={thread} />
      <SimpleBarReact style={{ height: '100%' }}>
        <div className="chat-content-scroll-area">
          {/* <ChatContentBodyIntro thread={thread} /> */}
          {chatMessages.loading ? (
            <Row className="g-0 w-100 h-100">
              <Col xs={12} className='d-flex align-items-center justify-content-center' style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                <Spinner animation="border" variant="grow" size='sm' />
              </Col>
            </Row>
          ) : (
            chatMessages.data && Object.keys(chatMessages.data).map((element) => (
              <div key={element}>
                <div className="text-center fs--2 text-500 pt-3">{element}</div>
                {chatMessages.data[element].map((message, index) => (
                  <Message
                    key={`${message.createdAt}_${index}`}
                    message={message}
                  />
                ))}
              </div>
            )))
          }
        </div>
        <div ref={messagesEndRef} />
      </SimpleBarReact>
    </div>
  );
};

ChatContentBody.propTypes = {
  thread: PropTypes.object.isRequired
};

export default ChatContentBody;
