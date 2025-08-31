import { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from '../../ui/Button';
import useEmojiPicker from '../messages/useEmojiPicker';
import EmojiPickerOverlay from '../../ui/EmojiPickerOverlay';

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  margin-right: 8px;
`;

const MessageForm = styled.form`
  display: flex;
  padding: 12px;
`;

const EditableInput = styled.div`
  /* flex: 1;
  padding: 10px;
  border: 1px solid var(--color-grey-300);
  border-radius: 20px;
  background-color: #f1f1f1;
  margin-right: 8px;
  min-height: 40px;
  outline: none;
  white-space: pre-wrap; */
  contenteditable: true;
  white-space: pre-wrap; // ✅ Allows wrapping at spaces and line breaks
  word-break: break-word; // ✅ Breaks long words if needed
  overflow-wrap: break-word; // ✅ Ensures wrapping even in tricky cases
  overflow-x: hidden; // ✅ Prevents horizontal scroll
  max-width: 100%; // ✅ Keeps it within container
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 40px;
  line-height: 1.4;
  font-size: 16px;
  outline: none;

  &:empty::before {
    content: attr(data-placeholder);
    color: var(--color-grey-400);
  }
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-left: 8px;
  margin-right: 8px;
`;

const UploadButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-right: 8px;
`;

function ChatForm({ receiver, onSendMessage }) {
  const [file, setFile] = useState(null);
  const editableRef = useRef(null);
  const fileInputRef = useRef(null);

  const {
    visible: showEmojiPicker,
    togglePicker,
    insertEmoji,
    saveCursor,
    setVisible,
  } = useEmojiPicker(editableRef);

  async function handleSubmit(e) {
    e.preventDefault();
    const content = editableRef.current.textContent.trim();
    if (!content && !file) return;

    await onSendMessage(receiver.id, content, file);

    editableRef.current.textContent = '';
    setFile(null);
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.borderRadius = '8px';
      img.style.marginRight = '8px';
      editableRef.current.appendChild(img);
    };
    reader.readAsDataURL(selectedFile);
    e.target.value = null;
  }

  return (
    <MessageForm onSubmit={handleSubmit}>
      <InputWrapper>
        <EditableInput
          contentEditable
          ref={editableRef}
          data-placeholder="Type a message..."
          onKeyUp={saveCursor}
          onMouseUp={saveCursor}
        />
        {showEmojiPicker && (
          <EmojiPickerOverlay
            onEmojiClick={insertEmoji}
            onClose={() => setVisible(false)}
          />
        )}
      </InputWrapper>
      <UploadButton
        type="button"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        title="Upload image"
      >
        📷
      </UploadButton>
      <EmojiButton type="button" onClick={togglePicker} title="Insert emoji">
        😊
      </EmojiButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Button type="submit">Send</Button>
    </MessageForm>
  );
}

export default ChatForm;
