import { useQuery } from '@tanstack/react-query';
import { getMessages, getUnreadMessageCount } from '../../services/apiMessage';

export function useMessages(senderId, receiverId) {
  const { isPending, data, error } = useQuery({
    queryKey: ['messages', senderId, receiverId],
    queryFn: async () => {
      const messages = await getMessages(senderId, receiverId);
      return messages;
    },
    enabled: !!senderId && !!receiverId,
  });

  return { isPending, error, messages: data ?? [] };
}

export function useUnreadMessageCount(userId) {
  const {
    data: unreadCount = 0,
    isPending,
    error,
  } = useQuery({
    queryKey: ['unreadMessages', userId],
    queryFn: () => getUnreadMessageCount(userId),
    enabled: !!userId,
    refetchInterval: 10000, // optional: auto-refresh every 10s
  });

  return { isPending, error, unreadCount };
}
