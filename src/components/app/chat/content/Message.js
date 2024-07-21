import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import ChatMessageOptions from './ChatMessageOptions';
import DefaultProfile from 'assets/img/avatar.png';
import ReactQuill from 'react-quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAdminDoc, markMessageAsRead } from 'helpers/query';
import AppContext from 'context/Context';

const Message = ({ message }) => {
  const isLeft = message.createdBy !== "You";
  const messageRef = useRef(null);
  const { userInfo } = useContext(AppContext);
  const [adminDoc, setAdminDoc] = useState({})
  const [membersHistory, setMembersHistory] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminDoc("User-Data", userInfo?.chat_group_options?.token_id);
        setAdminDoc(result)
        setMembersHistory(result?.members_history?.length || 0);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          markMessageAsRead(userInfo?.chat_group_options?.token_id, message.id, userInfo?.uid);
        }
      });
    }, { threshold: 0.1 });

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [message.id]);

  return (
    <div ref={messageRef}>
      <Flex className={classNames('p-3', { 'd-block': !isLeft })}>
        {isLeft && <Avatar size="l" className="me-2" src={message.user_image_path ?? DefaultProfile} />}
        <div
          className={classNames('flex-1', {
            'd-flex justify-content-end': !isLeft
          })}
        >
          <div
            className={classNames('w-xxl-75', {
              'w-100': !isLeft
            })}
          >
            <Flex
              alignItems="center"
              className={classNames('hover-actions-trigger', {
                'flex-end-center': !isLeft,
                'align-items-center': isLeft
              })}
            >
              {!isLeft && <ChatMessageOptions />}

              <div
                className={classNames('chat-message', {
                  'bg-soft-success text-dark': isLeft,
                  'bg-soft-info text-dark': !isLeft
                })}
              >
                {(message.message) && (
                  <ReactQuill
                    theme="bubble"
                    value={message.message}
                    readOnly
                    preserveWhitespace
                    className={`w-100 p-0 m-0 ${isLeft ? "border-success border-end border-end-3" : "border-info border-start border-start-3"} shadow-sm`}
                    modules={{ toolbar: false }}
                  />
                )}
              </div>
            </Flex>
            <div
              className={classNames('text-400 fs--2', {
                'text-end': !isLeft
              })}
            >
              {isLeft && (
                <>
                  {message?.sender_uid === adminDoc?.uid ? <FontAwesomeIcon icon="crown" className="me-1 text-warning" /> : null}
                  <span className="font-weight-semi-bold me-2">{message.createdBy}</span>
                </>
              )}
              {message.createdAt}
              {!isLeft && !!message.message && (
                <FontAwesomeIcon
                  icon={classNames({
                    'check-double': membersHistory == message?.readBy?.length,
                    'check': membersHistory !== message?.readBy?.length
                  })}
                  className={classNames('ms-2', {
                    'text-success': membersHistory == message?.readBy?.length
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default Message;
