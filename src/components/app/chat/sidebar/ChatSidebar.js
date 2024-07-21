import React, { useContext, useState } from 'react';
import { Col, Nav, Row, Spinner } from 'react-bootstrap';
import ChatThread from './ChatThread';
import SimpleBarReact from 'simplebar-react';
import classNames from 'classnames';
import { ChatContext } from 'context/ChatProvider';

const ChatSidebar = () => {
  const { chatHistory, hideSidebar } = useContext(ChatContext);

  return (
    <div className={classNames('chat-sidebar', { 'start-0': hideSidebar })}>
      <div className="contacts-list" style={{
        backgroundColor: "#f5f5f5"
      }}>
        <SimpleBarReact style={{ height: '100%', minWidth: '65px' }}>
          <Nav className="border-0">
            {chatHistory.loading ? (
              <Row className="g-0 w-100 h-100">
                <Col xs={12} className='d-flex align-items-center justify-content-center' style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
                  <Spinner animation="grow" variant="success" size='sm' />
                </Col>
              </Row>
            ) : (
              chatHistory.data.map((thread, index) => (
                <ChatThread thread={thread} index={index} key={thread.uid} />
              ))
            )}
          </Nav>
        </SimpleBarReact>
      </div>
    </div>
  );
};

export default ChatSidebar;
