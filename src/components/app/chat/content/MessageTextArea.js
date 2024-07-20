import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Picker from '@emoji-mart/react';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import AppContext from 'context/Context';
import { ChatContext } from 'context/ChatProvider';

const MessageTextArea = () => {
  const {
    handleScrollToBottom,
    isOpenThreadInfo
  } = useContext(ChatContext);
  const [previewEmoji, setPreviewEmoji] = useState(false);
  const [message, setMessage] = useState('');

  const {
    config: { isDark }
  } = useContext(AppContext);

  const addEmoji = e => {
    let emoji = e.native;
    setMessage(message + emoji);
    setPreviewEmoji(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
   
    setMessage('');
    handleScrollToBottom(true);
  };

  useEffect(() => {
    if (isOpenThreadInfo) {
      setPreviewEmoji(false);
    }
  }, [isOpenThreadInfo]);

  return (
    <Form className="chat-editor-area" onSubmit={handleSubmit}>
      <TextareaAutosize
        minRows={1}
        maxRows={10}
        value={message}
        placeholder="Type your message"
        onChange={({ target }) => setMessage(target.value)}
        className="form-control outline-none resize-none rounded-0 border-0 emojiarea-editor"
      />

      <Button
        variant="link"
        className="emoji-icon "
        onClick={() => setPreviewEmoji(!previewEmoji)}
      >
        <FontAwesomeIcon
          icon={['far', 'laugh-beam']}
          onClick={() => setPreviewEmoji(!previewEmoji)}
        />
      </Button>

      {previewEmoji && (
        <div className="chat-emoji-picker" dir="ltr">
          <Picker
            set="google"
            onEmojiSelect={addEmoji}
            theme={isDark ? 'dark' : 'light'}
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}

      <Button
        variant="send"
        size="sm"
        className={classNames('shadow-none', {
          'text-primary': message.length > 0
        })}
        type="submit"
      >
        Send
      </Button>
    </Form>
  );
};



export default MessageTextArea;
