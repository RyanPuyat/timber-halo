import { useDeleteMessage } from './useMessage';
import { useEffect, useRef } from 'react';
import { useDarkMode } from '../../context/DarkModeContext';
import styled from 'styled-components';
import MessageItem from './MessageItem';
import { updateStatusAsRead } from '../../services/apiMessage';
import { useUnreadMessages } from '../../context/UnreadMessageContext';

const MessagesWrapper = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

function ChatBox({ currentUser, receiver, messages = [] }) {
  const messagesEndRef = useRef();
  const isDarkMode = useDarkMode();
  const { isDeleting, deleteMessage } = useDeleteMessage(
    currentUser.id,
    receiver.id
  );
  const { resetUnread } = useUnreadMessages();

  useEffect(() => {
    const unreadMessages = messages.filter(
      (msg) => msg.receiver_id === currentUser.id && !msg.read_at
    );

    const unreadIds = unreadMessages.map((msg) => msg.id);
    const senderIds = [...new Set(unreadMessages.map((msg) => msg.sender_id))];

    if (unreadIds.length > 0) {
      console.log('Marking as read:', unreadIds);
      updateStatusAsRead(unreadIds);

      senderIds.forEach((senderId) => {
        resetUnread(senderId);
      });
    }
  }, [messages, currentUser.id, resetUnread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <MessagesWrapper>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => {
          const isSender = msg.sender_id === currentUser.id;
          const sender = isSender ? currentUser : receiver;

          return (
            <MessageItem
              key={msg.id}
              msg={msg}
              isSender={isSender}
              sender={sender}
              isDarkMode={isDarkMode}
              isDeleting={isDeleting}
              deleteMessage={deleteMessage}
            />
          );
        })
      )}
      <div ref={messagesEndRef} />
    </MessagesWrapper>
  );
}

export default ChatBox;
