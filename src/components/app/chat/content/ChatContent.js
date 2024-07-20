import React, { useContext } from 'react';
import { Col, Row, Spinner, Tab } from 'react-bootstrap';
import ChatContentHeader from './ChatContentHeader';
import ChatContentBody from './ChatContentBody';
import MessageTextArea from './MessageTextArea';
import { ChatContext } from 'context/ChatProvider';

const ChatContent = () => {
  const { chatHistory } = useContext(ChatContext);

  return (
    <Tab.Content className="card-chat-content">
      {chatHistory.loading ? (
        <Row className="g-0 w-100 h-100">
          <Col xs={12} className='d-flex align-items-center justify-content-center' style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
            <Spinner animation="grow" variant="success" size='sm' />
          </Col>
        </Row>
      ) : (
        chatHistory?.data?.map((thread, index) => (
          <Tab.Pane key={index} eventKey={index} className="card-chat-pane">
            <ChatContentHeader thread={thread} />
            <ChatContentBody thread={thread} />
          </Tab.Pane>
        )))}
      <MessageTextArea />
    </Tab.Content>
  );
};
export default ChatContent;
