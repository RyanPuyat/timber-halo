import Spinner from '../../ui/Spinner';
import styled from 'styled-components';
import { useAllUsers, useCurrentUserProfile } from './useAllUsers';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
import { NotificationBadge } from '../../ui/NotificationBadge';
const UserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  height: 4rem;
  width: 4rem;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function UserSidebar({ onSelect, receiverId }) {
  const { profiles } = useAllUsers();
  const { data: currentUser, isPending } = useCurrentUserProfile(); // Authenticated user
  const { unreadCounts } = useUnreadMessages();
  if (isPending || !currentUser) return <Spinner />;

  const filteredProfiles = profiles?.filter(
    (user) => user.id !== currentUser.id
  );

  // const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <aside>
      {filteredProfiles?.map((user) => {
        const unread = unreadCounts[user.id] || 0;
        const showBadge = user.id !== receiverId && unread > 0;

        return (
          <div key={user.id} onClick={() => onSelect(user)}>
            <UserAvatar>
              {showBadge ? (
                <NotificationBadge count={unread} pulse $top={'6px'}>
                  <Avatar
                    src={user.avatar_url || '/default-user.jpg'}
                    alt={user.full_name}
                  />
                </NotificationBadge>
              ) : (
                <Avatar
                  src={user.avatar_url || '/default-user.jpg'}
                  alt={user.full_name}
                />
              )}
              <span>{user.full_name}</span>
            </UserAvatar>
          </div>
        );
      })}
    </aside>
  );
}

export default UserSidebar;
