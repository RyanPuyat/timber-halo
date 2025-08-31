import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';
import useOutsideClick from '../hooks/useOutsideClick';

const FloatingEmojiPicker = styled.div`
  position: absolute;
  bottom: 50px;
  right: 0;
  z-index: 1000;
`;

export default function EmojiPickerOverlay({ onEmojiClick, onClose }) {
  const ref = useOutsideClick(onClose);

  return (
    <FloatingEmojiPicker ref={ref}>
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </FloatingEmojiPicker>
  );
}
