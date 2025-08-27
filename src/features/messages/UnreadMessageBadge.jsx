import { useUnreadMessage } from '../messages/useUnreadMessage';
import { useCurrentUserProfile } from '../messages/useAllUsers';
import { playMessageSound } from './useSoundAlert';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
import styled from 'styled-components';

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
  const { unreadCounts, incrementUnread } = useUnreadMessages();

  useUnreadMessage(userId, (message) => {
    const senderId = message.sender_id;
    if (typeof senderId === 'string') {
      incrementUnread(senderId);
      playMessageSound();
    } else {
      console.warn('⚠️ Invalid senderId:', senderId);
    }
    playMessageSound();
  });

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  if (totalUnread === 0) return null;

  return (
    <NotificationBadge>
      {totalUnread > 99 ? '99+' : totalUnread}
    </NotificationBadge>
  );
}

export default UnreadMessageBadge;

// function UnreadMessageBadge() {
//   const { data: currentUser } = useCurrentUserProfile();
//   const userId = currentUser?.id;

//   const [unreadCounts, setUnreadCounts] = useState({});

//   useUnreadMessage(userId, (message) => {
//     const senderId = message.senderId;
//     setUnreadCounts((prev) => ({
//       ...prev,
//       [senderId]: (prev[senderId] || 0) + 1,
//     }));
//     playMessageSound();
//   });

//   if (unreadCounts === 0) return null;

//   return (
//     <>
//       <NotificationBadge>
//         {unreadCounts > 99 ? '99+' : unreadCounts}
//       </NotificationBadge>
//     </>
//   );
// }

// export default UnreadMessageBadge;
