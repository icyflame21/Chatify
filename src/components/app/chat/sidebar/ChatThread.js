import React, { useContext } from 'react';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import Avatar from 'components/common/Avatar';
import { Nav } from 'react-bootstrap';
import { ChatContext } from 'context/ChatProvider';
import { getLastObject } from 'helpers/formatTimeStamp';
import LastMessage from './LastMessage';


const ChatThread = ({ thread, index }) => {
  const { getUser, chatMessages } = useContext(ChatContext);
  const user = getUser(thread);
  const lastMessage = getLastObject(chatMessages?.data);
  return (
    <Nav.Link
      eventKey={index}
      className={classNames(`chat-contact p-3`)}
    >
      <Flex>
        <Avatar className="status-online" src={user.avatarSrc} size="2xl" />
        <div className="flex-1 chat-contact-body ms-2 d-md-none d-lg-block">
          <Flex justifyContent="between">
            <h6 className="mb-0 chat-contact-title">{thread?.chat_group_options?.group_name}</h6>
            <span className="message-time fs--2">
              {' '}
              {!!lastMessage && lastMessage.createdAt}{' '}
            </span>
          </Flex>
          <div className="min-w-0">
            <div className="chat-contact-content pe-3">
              <LastMessage lastMessage={lastMessage} />
            </div>
          </div>
        </div>
      </Flex>
    </Nav.Link>
  );
};

export default ChatThread;
