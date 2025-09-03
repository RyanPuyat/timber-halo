import Spinner from '../../ui/Spinner';
import styled from 'styled-components';
import { useAllUsers, useCurrentUserProfile } from './useAllUsers';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
import { NotificationBadge } from '../../ui/NotificationBadge';
import Search from '../../ui/Search';
import { useState } from 'react';

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
  cursor: pointer;
`;
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
`;

const NoUser = styled.p`
  padding: 1rem;
  color: var(--color-grey-500);
`;

function UserSidebar({ onSelect, receiverId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { profiles } = useAllUsers();
  const { data: currentUser, isPending } = useCurrentUserProfile(); // Authenticated user
  const { unreadCounts } = useUnreadMessages();

  if (isPending || !currentUser) return <Spinner />;

  const filteredProfiles = profiles
    ?.filter((user) => user.id !== currentUser.id)
    .filter((user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Aside>
      <Search
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredProfiles?.length === 0 ? (
        <NoUser>No user found.</NoUser>
      ) : (
        filteredProfiles?.map((user) => {
          const unread = unreadCounts[user.id] || 0;
          const showBadge = user.id !== receiverId && unread > 0;

          return (
            <div key={user.id} onClick={() => onSelect(user)}>
              <UserAvatar>
                {showBadge ? (
                  <NotificationBadge
                    count={unread}
                    $pulse={false}
                    $top={'6px'}
                    $right={'1px'}
                  >
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
        })
      )}
    </Aside>
  );
}

export default UserSidebar;
