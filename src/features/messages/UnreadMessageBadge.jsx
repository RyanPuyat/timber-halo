import { useUnreadMessage } from '../messages/useUnreadMessage';
import { useCurrentUserProfile } from '../messages/useAllUsers';
import { playMessageSound } from './useSoundAlert';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
import { NotificationBadge } from '../../ui/NotificationBadge';
import { useEffect } from 'react';

function UnreadMessageBadge() {
  const { data: currentUser } = useCurrentUserProfile();
  const userId = currentUser?.id;
  const { unreadCounts, incrementUnread, receiverId, resetUnread } =
    useUnreadMessages();

  useUnreadMessage(userId, (message) => {
    const senderId = message.sender_id;
    if (typeof senderId !== 'string') {
      console.warn('⚠️ Invalid senderId:', senderId);
      return;
    }

    if (senderId === receiverId) {
      resetUnread(senderId);
      playMessageSound();
    } else {
      incrementUnread(senderId);
      playMessageSound();
    }
  });

  useEffect(() => {
    // console.log('Unread counts:', unreadCounts);
  }, [unreadCounts]);

  const filteredUnread = Object.entries(unreadCounts)
    .filter(([senderId]) => senderId !== receiverId)
    .reduce((sum, [, count]) => sum + count, 0);

  if (!filteredUnread || filteredUnread === 0) return null;

  return (
    <NotificationBadge
      count={filteredUnread}
      $top={'-30px'}
      $right={'-5px'}
      $pulse={true}
    />
  );
}

export default UnreadMessageBadge;
