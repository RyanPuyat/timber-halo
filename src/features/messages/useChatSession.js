import { useState, useMemo } from 'react';
import { useCurrentUserProfile } from './useAllUsers';
import { sendMessage } from '../../services/apiMessage';
import { useLiveMessages } from './useRealtimeMessages';
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
