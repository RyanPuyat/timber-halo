import supabase from '../../services/supabase';
import { useEffect } from 'react';

export function useUnreadMessage(userId, onUnreadMessage) {
  useEffect(() => {
    if (!userId || !onUnreadMessage) return;

    const channel = supabase
      .channel('dashboard-unread-listener')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.read === false) {
            onUnreadMessage(newMessage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onUnreadMessage]);
}
