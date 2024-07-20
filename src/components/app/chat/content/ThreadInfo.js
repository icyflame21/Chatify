import React, { useState, useContext } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import SimpleBarReact from 'simplebar-react';
import { ChatContext } from 'context/ChatProvider';
import DefaultProfile from 'assets/img/avatar.png'

const ThreadInfo = ({ thread }) => {
  const [isOpenMemberCollapse, setIsOpenMemberCollapse] = useState(true);

  const { getUser, isOpenThreadInfo } = useContext(ChatContext);
  const user = getUser(thread);

  return (
    <div
      className={classNames('conversation-info', { show: isOpenThreadInfo })}
    >
      <div className="h-100 overflow-auto">
        <SimpleBarReact
          style={{
            height: '100%',
            minWidth: '75px'
          }}
        >
          <Flex
            alignItems="center"
            className="position-relative p-3"
          >
            <Avatar className="status-online" size="xl" src={user.avatarSrc} />
            <Flex className="ms-2 flex-between-center flex-1">
              <h6 className="mb-0">
                <Link
                  to="#!"
                  className="text-decoration-none stretched-link text-700"
                >
                  {thread?.chat_group_options?.group_name}
                </Link>
              </h6>
            </Flex>
          </Flex>

          <hr className="my-2" />
          <div className="px-3">
            <div className="title">
              <Button
                variant="link"
                aria-expanded={isOpenMemberCollapse}
                className="btn-accordion hover-text-decoration-none dropdown-indicator w-100"
                onClick={() =>
                  setIsOpenMemberCollapse(!isOpenMemberCollapse)
                }
              >
                Members
              </Button>
              <Collapse in={isOpenMemberCollapse}>
                <div>
                  {thread?.members_history?.map((member) => (
                    <Flex
                      className="align-items-center py-2 hover-actions-trigger"
                      key={member.uid}
                    >
                      <Avatar
                        className="status-online"
                        size="xl"
                        src={member.image ?? DefaultProfile}
                      />
                      <div className="d-flex flex-1 ms-2 justify-content-between">
                        <div>
                          <h6 className="mb-0">
                            <Link to="#!" className="text-700">
                              {member.name}
                            </Link>
                          </h6>
                          <div className="fs--2 text-400">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    </Flex>
                  ))}
                </div>
              </Collapse>
            </div>
          </div>
        </SimpleBarReact>
      </div>
    </div>
  );
};

export default ThreadInfo;
