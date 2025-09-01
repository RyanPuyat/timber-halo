import { useUnreadMessage } from '../messages/useUnreadMessage';
import { useCurrentUserProfile } from '../messages/useAllUsers';
import { playMessageSound } from './useSoundAlert';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
import { NotificationBadge } from '../../ui/NotificationBadge';
import { useEffect } from 'react';

function UnreadMessageBadge() {
  const { data: currentUser } = useCurrentUserProfile();
  const userId = currentUser?.id;
  const {
    unreadCounts,
    incrementUnread,
    //localhost:3000/dashboard
    http: receiverId,
    resetUnread,
  } = useUnreadMessages();

  useUnreadMessage(userId, (message) => {
    const senderId = message.sender_id;
    if (typeof senderId !== 'string') {
      console.warn('⚠️ Invalid senderId:', senderId);
      return;
    }

    if (senderId === receiverId) {
      // You're already viewing this chat — mark it as read
      resetUnread(senderId);
      playMessageSound();
    } else {
      // You're not viewing this chat — increment unread
      incrementUnread(senderId);
      playMessageSound();
    }
  });

  useEffect(() => {
    console.log('Unread counts:', unreadCounts);
  }, [unreadCounts]);

  const filteredUnread = Object.entries(unreadCounts)
    .filter(([senderId]) => senderId !== receiverId)
    .reduce((sum, [, count]) => sum + count, 0);

  if (!filteredUnread || filteredUnread === 0) return null;

  // const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // const isActiveUser = activeUserId !== userId;

  // if (totalUnread === 0 || !isActiveUser) return null;

  return <NotificationBadge count={filteredUnread} />;
}

export default UnreadMessageBadge;
