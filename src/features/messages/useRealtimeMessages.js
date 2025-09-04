import { useEffect } from 'react';
import supabase from '../../services/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '../../services/apiMessage';

export function useLiveMessages(senderId, receiverId) {
  const queryClient = useQueryClient();
  const queryKey = ['messages', senderId, receiverId];

  useEffect(() => {
    if (!senderId || !receiverId) {
      return;
    }

    const conversationId =
      senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;

    const channel = supabase
      .channel(`chat-channel-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          const isRelevant =
            eventType === 'DELETE'
              ? !!oldRow?.id
              : (oldRow?.sender_id === senderId &&
                  oldRow?.receiver_id === receiverId) ||
                (oldRow?.sender_id === receiverId &&
                  oldRow?.receiver_id === senderId) ||
                (newRow?.sender_id === senderId &&
                  newRow?.receiver_id === receiverId) ||
                (newRow?.sender_id === receiverId &&
                  newRow?.receiver_id === senderId);

          if (!isRelevant) return;

          queryClient.setQueryData(queryKey, (oldMessages) => {
            if (!oldMessages) return [];

            if (eventType === 'INSERT') {
              // Add a new message, preventing duplicates
              const isDuplicate = oldMessages.some(
                (msg) => msg.id === newRow.id
              );
              return isDuplicate ? oldMessages : [...oldMessages, newRow];
            }

            if (eventType === 'DELETE') {
              // Remove a deleted message
              return oldMessages.filter((msg) => msg.id !== oldRow.id);
            }
            //  Update
            if (eventType === 'UPDATE') {
              console.log('Realtime update:', newRow);
              return oldMessages.map((msg) =>
                msg.id === newRow.id ? { ...msg, ...newRow } : msg
              );
            }
            return oldMessages;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, senderId, receiverId]);

  const { isPending, data, error } = useQuery({
    queryKey,
    queryFn: () => getMessages(senderId, receiverId),
    enabled: !!senderId && !!receiverId,
    staleTime: Infinity,
  });

  return { isPending, error, messages: data ?? [] };
}
