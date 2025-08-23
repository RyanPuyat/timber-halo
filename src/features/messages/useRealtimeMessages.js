import { useEffect } from 'react';
import supabase from '../../services/supabase';

export function useRealtimeMessages(senderId, receiverId, onMessage) {
  useEffect(() => {
    console.log('🧠 useRealtimeMessages running with:', senderId, receiverId);
    if (!senderId || !receiverId || !onMessage) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('📡 Supabase payload received:', payload);
          const newMessage = payload.new;

          const isRelevant =
            (newMessage.sender_id === senderId &&
              newMessage.receiver_id === receiverId) ||
            (newMessage.sender_id === receiverId &&
              newMessage.receiver_id === senderId);

          if (isRelevant) {
            onMessage(newMessage);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [senderId, receiverId, onMessage]);
}
