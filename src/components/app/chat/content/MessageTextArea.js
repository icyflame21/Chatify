import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Picker from '@emoji-mart/react';
import { Button, Form, Spinner } from 'react-bootstrap';
import AppContext from 'context/Context';
import { ChatContext } from 'context/ChatProvider';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './MessageTextArea.css';
import { firestore } from 'config';
import { showToast } from 'helpers/toast';
import { getAdminDoc } from 'helpers/query';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const MessageTextArea = () => {
  const { handleScrollToBottom, isOpenThreadInfo, isSending, handleIsSending } = useContext(ChatContext);
  const [previewEmoji, setPreviewEmoji] = useState(false);
  const [message, setMessage] = useState('');
  const { config: { isDark }, userInfo } = useContext(AppContext);
  const quillRef = useRef(null);

  const addEmoji = (e) => {
    let emoji = e.native;
    const quill = quillRef.current.getEditor();
    const cursorPosition = quill.getSelection()?.index || 0;
    quill.insertText(cursorPosition, emoji, 'user');
    quill.setSelection(cursorPosition + emoji.length, 0);
    setPreviewEmoji(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    handleIsSending(true);

    try {
      const getAdmin = await getAdminDoc("User-Data", userInfo?.chat_group_options?.token_id);
      const token_id = userInfo?.chat_group_options?.token_id;

      if (!getAdmin?.chat_group_options?.isLogout) {
        await addDoc(collection(firestore, token_id), {
          message,
          createdAt: serverTimestamp(),
          createdBy: userInfo?.userName,
          sender_uid: userInfo?.uid,
          user_image_path: userInfo?.userProfilePhoto,
          sender_email: userInfo?.userEmail,
          isActive: true,
        });

        setMessage('');
        quillRef.current.getEditor().setText('');
        handleScrollToBottom(true);
      } else {
        showToast('Failed to send message. Admin is not online.', 'info');
      }
    } catch (err) {
      showToast(`Failed to send message. Please try again.`, 'danger');
      console.error('Error adding document: ', err);
    } finally {
      handleIsSending(false);
    }
  };

  useEffect(() => {
    if (isOpenThreadInfo) {
      setPreviewEmoji(false);
    }
  }, [isOpenThreadInfo]);

  return (
    <Form className="chat-editor-area" onSubmit={handleSubmit}>
      <ReactQuill
        ref={quillRef}
        theme="bubble"
        value={message}
        onChange={setMessage}
        placeholder="Type your message"
        className='w-100 border border-1'
        modules={{ toolbar: false }}
        bounds='.chat-editor-area'
      />
      <Button
        variant="link"
        className="emoji-icon"
        onClick={() => setPreviewEmoji((prev) => !prev)}
      >
        <FontAwesomeIcon icon={['far', 'laugh-beam']} />
      </Button>
      {previewEmoji && (
        <div className="chat-emoji-picker">
          <Picker
            set="apple"
            onEmojiSelect={addEmoji}
            theme={isDark ? 'dark' : 'light'}
            previewPosition="none"
            skinTonePosition="search"
          />
        </div>
      )}
      <Button
        variant="send"
        disabled={isSending}
        className={classNames('shadow-none', { 'text-primary': message.length > 0 })}
        type="submit"
      >
        {isSending ? (
          <div className="d-inline-flex align-items-center">
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
            <span>Sending...</span>
          </div>
        ) : (
          'Send'
        )}
      </Button>
    </Form>
  );
};

export default MessageTextArea;
