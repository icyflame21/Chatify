import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { ChatContext } from 'context/ChatProvider';
import Avatar from 'components/common/Avatar';

const ChatContentHeader = ({ thread }) => {
  const { getUser, isOpenThreadInfo, handleOpenThreadInfo, handleHideSideBar } = useContext(ChatContext);
  const user = getUser(thread);

  return (
    <div className="chat-content-header">
      <Row className="flex-between-center">
        <Col xs={6} md={8} as={Flex} alignItems="center">
          <div
            className="pe-3 text-700 d-md-none contacts-list-show cursor-pointer"
            onClick={() => handleHideSideBar(true)}
          >
            <FontAwesomeIcon icon="chevron-left" />
          </div>

          <div className="min-w-0">
            <Flex
              alignItems="center"
              className='gap-2'
            >
              <Avatar className="status-online" size="xl" src={user.avatarSrc} />
              <div>
                <h5 className="mb-0 text-truncate fs-0">{thread?.chat_group_options?.group_name}</h5>
                <div className="fs--2 text-400">
                  Active on  chat
                </div>
              </div>
            </Flex>
          </div>
        </Col>
        <Col xs="auto">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip style={{ position: 'fixed' }}>
                Group Information
              </Tooltip>
            }
          >
            <Button
              variant="falcon-primary"
              size="sm"
              onClick={() => handleOpenThreadInfo(!isOpenThreadInfo)}
            >
              <FontAwesomeIcon icon="info" />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </div>
  );
};

export default ChatContentHeader;
