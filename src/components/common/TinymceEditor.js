import React, { useContext, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { getColor } from 'helpers/utils';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import AppContext from 'context/Context';

const TinymceEditor = ({ value, handleChange, height = '5vh', isInvalid }) => {
  const { config: { isDark } } = useContext(AppContext);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.dom.addStyle(
        `body{color: ${getColor('white')} !important;}`
      );
    }
  }, [isDark]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        if (editorRef.current) {
          editorRef.current.insertContent(`<img src="${base64}" alt="${file.name}" />`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={classNames('dropzone form-control outline-none resize-none rounded-0 border-0', { 'is-invalid': isInvalid })}
      style={{ height: height, overflow: 'auto' }}
    >
      <input {...getInputProps()} />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={handleChange}
        apiKey={process.env.REACT_APP_TINYMCE_APIKEY}
        init={{
          height,
          menubar: false,
          toolbar: false,
          plugins: [],
          content_style: `body { color: ${getColor('black')} }`,
          statusbar: false,
          directionality: 'ltr',
          setup: (editor) => {
            editor.on('keydown', (e) => {
              if (e.keyCode === 13) { // Enter key
                const currentHeight = editor.iframeElement.contentDocument.body.offsetHeight;
                const lineHeight = parseInt(window.getComputedStyle(editor.iframeElement.contentDocument.body).lineHeight, 10);
                const rows = Math.floor(currentHeight / lineHeight);
                if (rows >= 6) {
                  e.preventDefault();
                }
              }
            });
          },
        }}
      />
    </div>
  );
};

export default TinymceEditor;
