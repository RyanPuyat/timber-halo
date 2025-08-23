import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MessagesWrapper = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 12px;
  justify-content: ${({ $isSender }) =>
    $isSender ? 'flex-end' : 'flex-start'};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: ${({ $isSender }) => ($isSender ? '#DCF8C6' : '#FFF')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SenderName = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const MessageText = styled.div`
  font-size: 14px;
`;

function ChatBox({ currentUser, receiver, messages = [] }) {
  //   const [content, setContent] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <MessagesWrapper>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender_id === currentUser.id;
            const sender = isSender ? currentUser : receiver;

            return (
              <MessageRow key={msg.id} $isSender={isSender}>
                {!isSender && (
                  <Avatar
                    src={sender.avatar_url || '/default-user.jpg'}
                    alt={sender.name}
                  />
                )}
                <MessageBubble $isSender={isSender}>
                  <SenderName>{sender.name}</SenderName>
                  <MessageText>{msg.content}</MessageText>
                </MessageBubble>
              </MessageRow>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesWrapper>

      {/* <ChatForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </ChatForm> */}
    </>
  );
}

export default ChatBox;
