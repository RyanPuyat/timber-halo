import { useQuery } from '@tanstack/react-query';
import { getMessages } from '../../services/apiMessage';

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
