import React from 'react';
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
// import ChatMessageOptions from './ChatMessageOptions';
import DefaultProfile from 'assets/img/avatar.png'

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
            {/* {!isLeft && <ChatMessageOptions />} */}

            <div
              className={classNames('p-2 rounded-2 chat-message', {
                'bg-200': isLeft,
                'bg-primary text-white light': !isLeft
              })}
            >
              {(message.message) && (
                <p
                  className="mb-0"
                  dangerouslySetInnerHTML={{
                    __html: JSON.parse(JSON.stringify(message.message))
                  }}
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
