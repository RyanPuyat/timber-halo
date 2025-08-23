import { useState } from 'react';
import styled from 'styled-components';
import Button from '../../ui/Button';

const MessageForm = styled.form`
  display: flex;
  padding: 12px;
  /* border-top: 1px solid #ddd; */
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid var(--color-grey-300);
  border-radius: 20px;
  background-color: #f1f1f1;
  margin-right: 8px;
`;

function ChatForm({ receiver, onSendMessage }) {
  const [content, setContent] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

    await onSendMessage(receiver.id, content);
    setContent('');
  }

  return (
    <MessageForm onSubmit={handleSubmit}>
      <Input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
      />
      <Button type="submit">Send</Button>
    </MessageForm>
  );
}

export default ChatForm;
