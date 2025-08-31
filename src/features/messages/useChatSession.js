import { useState, useMemo } from 'react';
import { useCurrentUserProfile } from './useAllUsers';
import { sendMessage } from '../../services/apiMessage';
import { useLiveMessages } from './useRealtimeMessages'; // Import the new hook

export function useChatSession() {
  const [receiver, setReceiver] = useState(null);
  const { data: currentUser } = useCurrentUserProfile();

  const userIds = useMemo(() => {
    return {
      senderId: currentUser?.id,
      receiverId: receiver?.id,
    };
  }, [currentUser?.id, receiver?.id]);

  const { messages, error } = useLiveMessages(
    userIds.senderId,
    userIds.receiverId
  );

  async function handleSendMessage(receiverId, content, file) {
    await sendMessage(currentUser?.id, receiverId, content, file);
  }

  return {
    currentUser,
    receiver,
    setReceiver,
    messages,
    handleSendMessage,
    error,
  };
}

// import { useState, useEffect, useCallback } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { useMessages } from './useMessage';
// import { useRealtimeMessages } from './useRealtimeMessages';
// import { sendMessage } from '../../services/apiMessage';
// import { useCurrentUserProfile } from './useAllUsers';

// export function useChatSession() {
//   const [receiver, setReceiver] = useState(null);
//   const [combinedMessages, setCombinedMessages] = useState([]);
//   const queryClient = useQueryClient();

//   const { data: currentUser } = useCurrentUserProfile();
//   const { messages, error } = useMessages(currentUser?.id, receiver?.id);

//   useEffect(() => {
//     if (!receiver || !messages || messages.length === 0) return;

//     setCombinedMessages((prev) => {
//       const prevIds = new Set(prev.map((msg) => msg.id));
//       const newMessages = messages.filter((msg) => !prevIds.has(msg.id));

//       if (newMessages.length === 0) return prev;

//       return [...prev, ...newMessages];
//     });
//   }, [messages, receiver]);

//   const handleNewRealtimeMessage = useCallback((newMsg) => {
//     setCombinedMessages((prev) => [...prev, newMsg]);
//   }, []);

//   const handleDeleteRealtimeMessage = useCallback((deletedId) => {
//     setCombinedMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
//   }, []);

//   useRealtimeMessages(
//     currentUser?.id,
//     receiver?.id,
//     handleNewRealtimeMessage,
//     handleDeleteRealtimeMessage
//   );

//   async function handleSendMessage(receiverId, content, file) {
//     await sendMessage(currentUser?.id, receiverId, content, file);
//     queryClient.invalidateQueries(['messages', currentUser.id, receiverId]);
//   }

//   return {
//     currentUser,
//     receiver,
//     setReceiver,
//     combinedMessages,
//     handleSendMessage,
//     error,
//   };
// }
