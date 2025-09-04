import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getUnreadMessageCount } from '../../services/apiMessage';
import { deleteMessage as deleteMessageApi } from '../../services/apiMessage';

export function useUnreadMessageCount(userId) {
  const {
    data: unreadCount = 0,
    isPending,
    error,
  } = useQuery({
    queryKey: ['unreadMessages', userId],
    queryFn: () => getUnreadMessageCount(userId),
    enabled: !!userId,
    refetchInterval: 10000,
  });

  return { isPending, error, unreadCount };
}

export function useDeleteMessage(senderId, receiverId) {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteMessage } = useMutation({
    mutationFn: ({ id, filePath }) => deleteMessageApi(id, filePath),

    onSuccess: () => {
      toast.success('Message successfully deleted');

      queryClient.invalidateQueries(['messages', senderId, receiverId]);
    },

    onError: (err) => {
      console.error('Delete message error:', err);
      toast.error(err.message || 'Failed to delete message');
    },
  });

  return { isDeleting, deleteMessage };
}
