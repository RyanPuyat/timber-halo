import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserProfile } from '../messages/useAllUsers';
import { useAllUsers } from '../messages/useAllUsers';
import { useMessages } from '../messages/useMessage';
import { sendMessage } from '../services/apiMessages';
import ChatBox from '../components/ChatBox';

function ChatLayout() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const { profiles = [] } = useAllUsers();
  const [receiver, setReceiver] = useState(null);

  const { data: messages = [] } = useMessages(currentUser?.id, receiver?.id);

  async function handleSendMessage(receiverId, content) {
    await sendMessage(currentUser.id, receiverId, content);
    queryClient.invalidateQueries(['messages', currentUser.id, receiverId]);
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar: List of users to chat with */}
      <div
        style={{
          width: '250px',
          borderRight: '1px solid #ddd',
          padding: '16px',
        }}
      >
        <h3>Users</h3>
        {profiles
          .filter((user) => user.id !== currentUser?.id)
          .map((user) => (
            <div
              key={user.id}
              style={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor:
                  receiver?.id === user.id ? '#eee' : 'transparent',
              }}
              onClick={() => setReceiver(user)}
            >
              <img
                src={user.avatar_url}
                alt={user.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  marginRight: '8px',
                }}
              />
              {user.name}
            </div>
          ))}
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1 }}>
        {receiver ? (
          <ChatBox
            currentUser={currentUser}
            receiver={receiver}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <p style={{ padding: '16px' }}>Select a user to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default ChatLayout;
