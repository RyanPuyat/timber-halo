import { useUnreadMessage } from '../messages/useUnreadMessage';
import { useCurrentUserProfile } from '../messages/useAllUsers';
import styled from 'styled-components';
import { useState } from 'react';
import { playMessageSound } from './useSoundAlert';

const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -2px;
  width: 20px;
  height: 20px;
  background-color: var(--color-red-700);
  color: var(--color-grey-100);
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--color-grey-0);

  display: flex;
  align-items: center;
  justify-content: center;

  animation: pulse 1s ease-in-out infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

function UnreadMessageBadge() {
  const { data: currentUser } = useCurrentUserProfile();

  const userId = currentUser?.id;
  // const { isPending, unreadCount } = useUnreadMessageCount(userId);

  // if (isPending || unreadCount === 0) return null;

  const [unreadCount, setUnreadCount] = useState(0);

  useUnreadMessage(userId, () => {
    setUnreadCount((prev) => prev + 1);
    playMessageSound();
  });

  if (unreadCount === 0) return null;

  return (
    <>
      <NotificationBadge>
        {unreadCount > 99 ? '99+' : unreadCount}
      </NotificationBadge>
    </>
  );
}

export default UnreadMessageBadge;
