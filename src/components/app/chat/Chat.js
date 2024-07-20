import Flex from 'components/common/Flex';
import React, { useContext, useEffect } from 'react';
import { Card, Tab } from 'react-bootstrap';
import ChatContent from './content/ChatContent';
import ChatSidebar from './sidebar/ChatSidebar';
import { ChatContext } from 'context/ChatProvider';
import { getAdminDoc } from 'helpers/query';
import useFetchMessages from 'helpers/fetchMessages';
import AppContext from 'context/Context';

const ChatTab = () => {
  const fetchMessages = useFetchMessages();
  const { userInfo } = useContext(AppContext);
  const { handleHideSideBar, handleScrollToBottom,handleChatHistory } = useContext(ChatContext);
  
  useEffect(() => {
    if (userInfo?.chat_group_options?.token_id) {
      const fetchChatHistory = async () => {
        try {
          const result = await getAdminDoc("User-Data", userInfo?.chat_group_options?.token_id);
          handleChatHistory({
            data: [result]
          });
          fetchMessages()
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        } finally {
          handleChatHistory({
            loading: false
          });
        }
      };

      fetchChatHistory();
    }
    document.title = "Chatify | Social";

  }, []);
  
  return (
    <Tab.Container
      id="left-tabs-example"
      defaultActiveKey="0"
      onSelect={() => {
        handleHideSideBar(false)
        handleScrollToBottom(true);
      }}
    >
      <Card className="card-chat overflow-hidden">
        <Card.Body as={Flex} className="p-0 h-100">
          <ChatSidebar />
          <ChatContent />
        </Card.Body>
      </Card>
    </Tab.Container>
  );
};

const Chat = () => {
  return (
    <ChatTab />
  );
};

export default Chat;
