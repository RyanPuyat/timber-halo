import { useEffect } from 'react';
import supabase from '../../services/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '../../services/apiMessage';

export function useLiveMessages(senderId, receiverId) {
  const queryClient = useQueryClient();
  const queryKey = ['messages', senderId, receiverId];

  useEffect(() => {
    if (!senderId || !receiverId) {
      console.log('Realtime subscription skipped: missing IDs');
      return;
    }

    console.log('--- Subscribing to Realtime Channel ---');

    const conversationId =
      senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;

    console.log('Channel:', `chat-channel-${conversationId}`);

    const channel = supabase
      .channel(`chat-channel-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, DELETE, UPDATE)
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log(`${payload.eventType} event received:`, payload);
          const { eventType, new: newRow, old: oldRow } = payload;

          // Check if the message is relevant to the current conversation

          const isRelevant =
            eventType === 'DELETE'
              ? !!oldRow?.id // Assume relevance if we got an ID
              : (oldRow?.sender_id === senderId &&
                  oldRow?.receiver_id === receiverId) ||
                (oldRow?.sender_id === receiverId &&
                  oldRow?.receiver_id === senderId) ||
                (newRow?.sender_id === senderId &&
                  newRow?.receiver_id === receiverId) ||
                (newRow?.sender_id === receiverId &&
                  newRow?.receiver_id === senderId);

          if (!isRelevant) return;

          // Update the React Query cache based on the event type
          queryClient.setQueryData(queryKey, (oldMessages) => {
            if (!oldMessages) return [];

            if (eventType === 'INSERT') {
              console.log(
                '✅ INSERT event detected. New message:',
                payload.new
              );
              // Add a new message, preventing duplicates
              const isDuplicate = oldMessages.some(
                (msg) => msg.id === newRow.id
              );
              return isDuplicate ? oldMessages : [...oldMessages, newRow];
            }
            console.log('Event type received:', eventType);
            if (eventType === 'DELETE') {
              console.log(
                '❌ DELETE event detected. Deleted message ID:',
                payload.old.id
              );
              // Remove a deleted message
              return oldMessages.filter((msg) => msg.id !== oldRow.id);
            }
            // Add more conditions for UPDATE if needed
            return oldMessages;
          });
        }
      )
      .subscribe();

    return () => {
      // Clean up the subscription when the component unmounts
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, senderId, receiverId]);

  // Step 2: Use a standard React Query hook to get the initial data.
  // The real-time listener will take over from here.
  const { isPending, data, error } = useQuery({
    queryKey,
    queryFn: () => getMessages(senderId, receiverId),
    enabled: !!senderId && !!receiverId,
    staleTime: Infinity, // This is crucial. It tells React Query to trust the cache indefinitely because the real-time listener will keep it fresh.
  });

  return { isPending, error, messages: data ?? [] };
}

// export function useRealtimeMessages(senderId, receiverId, onMessage) {
//   useEffect(() => {
//     // console.log('🧠 useRealtimeMessages running with:', senderId, receiverId);
//     if (!senderId || !receiverId || !onMessage) return;

//     const channel = supabase
//       .channel('messages-realtime')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//         },
//         (payload) => {
//           // console.log('📡 Supabase payload received:', payload);
//           const newMessage = payload.new;

//           const isRelevant =
//             (newMessage.sender_id === senderId &&
//               newMessage.receiver_id === receiverId) ||
//             (newMessage.sender_id === receiverId &&
//               newMessage.receiver_id === senderId);

//           if (isRelevant) {
//             onMessage(newMessage);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, [senderId, receiverId, onMessage]);
// }
