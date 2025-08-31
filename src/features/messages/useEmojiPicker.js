import { useState, useRef } from 'react';

export default function useEmojiPicker(editableRef) {
  const [visible, setVisible] = useState(false);
  const savedRangeRef = useRef(null);

  function togglePicker() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
    setVisible((prev) => !prev);
  }

  function insertEmoji(emoji) {
    editableRef.current.focus();

    const selection = window.getSelection();
    selection.removeAllRanges();

    if (savedRangeRef.current) {
      selection.addRange(savedRangeRef.current);
    }

    const range = selection.getRangeAt(0);
    const emojiNode = document.createTextNode(emoji.emoji);
    range.deleteContents();
    range.insertNode(emojiNode);

    range.setStartAfter(emojiNode);
    range.setEndAfter(emojiNode);
    selection.removeAllRanges();
    selection.addRange(range);

    savedRangeRef.current = range.cloneRange();
  }

  function saveCursor() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  }

  return { visible, togglePicker, insertEmoji, saveCursor, setVisible };
}
