import React from 'react';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import ChatMessageOptions from './ChatMessageOptions';
import DefaultProfile from 'assets/img/avatar.png'
import ReactQuill from 'react-quill';

const Message = ({ message }) => {
  const isLeft = message.createdBy !== "You";

  return (
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
                  className={`w-100 border-start border-start-3 p-0 m-0 ${isLeft ? "border-success" : "border-info"} shadow-sm`}
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
              <span className="font-weight-semi-bold me-2">{message.createdBy}</span>
            )}
            {message.createdAt}
          </div>
        </div>
      </div>
    </Flex>
  );
};

export default Message;
