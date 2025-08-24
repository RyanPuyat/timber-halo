import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMessages } from './useMessage';
import { useRealtimeMessages } from './useRealtimeMessages';
import { sendMessage } from '../../services/apiMessage';
import { useCurrentUserProfile } from './useAllUsers';

export function useChatSession() {
  const [receiver, setReceiver] = useState(null);
  const [combinedMessages, setCombinedMessages] = useState([]);
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUserProfile();
  const { messages, error } = useMessages(currentUser?.id, receiver?.id);

  useEffect(() => {
    if (messages && messages.length > 0 && combinedMessages.length === 0) {
      setCombinedMessages(messages);
    }
  }, [messages, combinedMessages]);

  const handleNewRealtimeMessage = useCallback((newMsg) => {
    setCombinedMessages((prev) => [...prev, newMsg]);
  }, []);

  useRealtimeMessages(currentUser?.id, receiver?.id, handleNewRealtimeMessage);

  async function handleSendMessage(receiverId, content) {
    await sendMessage(currentUser.id, receiverId, content);
    queryClient.invalidateQueries(['messages', currentUser.id, receiverId]);
  }

  return {
    currentUser,
    receiver,
    setReceiver,
    combinedMessages,
    handleSendMessage,
    error,
  };
}
