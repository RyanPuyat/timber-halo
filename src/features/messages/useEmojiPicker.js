import { useState, useRef } from 'react';

export default function useEmojiPicker(editableRef) {
  const [visible, setVisible] = useState(false);
  const savedRangeRef = useRef(null);

  function isInsideEditable(selection) {
    const editable = editableRef.current;
    return (
      selection &&
      selection.rangeCount > 0 &&
      editable &&
      editable.contains(selection.anchorNode)
    );
  }

  function togglePicker() {
    const selection = window.getSelection();
    if (isInsideEditable(selection)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
    setVisible((prev) => !prev);
  }

  function insertEmoji(emoji) {
    setTimeout(() => {
      const editable = editableRef.current;
      const savedRange = savedRangeRef.current;

      if (!editable || !savedRange) return;

      editable.focus();

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);

      const range = selection.getRangeAt(0);
      const emojiNode = document.createTextNode(emoji.emoji);

      range.deleteContents();
      range.insertNode(emojiNode);

      range.setStartAfter(emojiNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      savedRangeRef.current = range.cloneRange();
    }, 0);
  }

  function saveCursor() {
    const selection = window.getSelection();
    const editable = editableRef.current;

    if (
      selection &&
      selection.rangeCount > 0 &&
      editable &&
      editable.contains(selection.anchorNode)
    ) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  }

  return {
    visible,
    togglePicker,
    insertEmoji,
    saveCursor,
    setVisible,
    isInsideEditable,
  };
}
