import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../ui/Button';
import useEmojiPicker from '../messages/useEmojiPicker';
import EmojiPickerOverlay from '../../ui/EmojiPickerOverlay';
import { HiFaceSmile, HiPaperClip } from 'react-icons/hi2';

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  margin-right: 8px;
  align-items: row;
`;

const MessageForm = styled.form`
  display: flex;
  padding: 12px;
`;

const EditableInput = styled.div`
  contenteditable: true;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden;
  max-width: 100%;
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
const BaseButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 6px;
  margin: 0 8px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-grey-100);
  }

  &:active {
    background-color: var(--color-grey-200);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-grey-300);
  }
`;

const EmojiButton = styled(BaseButton)``;
const UploadButton = styled(BaseButton)`
  height: 36px;
`;
const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  width: 24px;
  height: 24px;
  vertical-align: middle;
`;

function ChatForm({ receiver, onSendMessage }) {
  const [file, setFile] = useState(null);
  const editableRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (receiver && editableRef.current) {
      editableRef.current.focus();
    }
  }, [receiver]);

  const [renderPicker, setRenderPicker] = useState(false);

  const {
    visible: showEmojiPicker,
    togglePicker,
    insertEmoji,
    saveCursor,
    setVisible,
  } = useEmojiPicker(editableRef);

  useEffect(() => {
    if (showEmojiPicker) {
      requestAnimationFrame(() => setRenderPicker(true));
    } else {
      setRenderPicker(false);
    }
  }, [showEmojiPicker]);

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
          onInput={saveCursor}
          onFocus={saveCursor}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              document.querySelector('form').requestSubmit();
            }
          }}
        />
        {showEmojiPicker && (
          <EmojiPickerOverlay
            onEmojiClick={insertEmoji}
            lazyLoadEmojis={true}
            skinTonesDisabled={true}
            searchDisabled={true}
            height={300}
            width={320}
            emojiStyle="native"
            categories={['smileys', 'animals', 'food']}
            onClose={() => setVisible(false)}
          />
        )}
      </InputWrapper>
      <UploadButton
        type="button"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        title="Upload image"
      >
        <Icon style={{ transform: 'translateY(2px)' }}>
          <HiPaperClip />
        </Icon>
      </UploadButton>

      <EmojiButton type="button" onClick={togglePicker} title="Insert emoji">
        <Icon>
          <HiFaceSmile />
        </Icon>
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
