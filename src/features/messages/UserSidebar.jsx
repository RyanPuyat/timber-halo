import Spinner from '../../ui/Spinner';
import styled from 'styled-components';
import { useAllUsers, useCurrentUserProfile } from './useAllUsers';

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

function UserSidebar({ onSelect }) {
  const { profiles } = useAllUsers();
  const { data: currentUser, isPending } = useCurrentUserProfile(); // Authenticated user

  if (isPending || !currentUser) return <Spinner />;

  const filteredProfiles = profiles?.filter(
    (user) => user.id !== currentUser.id
  );

  return (
    <aside>
      {filteredProfiles?.map((user) => (
        <div
          key={user.id}
          onClick={() => {
            onSelect(user);
          }}
        >
          <UserAvatar>
            <Avatar
              src={user.avatar_url || '/default-user.jpg'}
              alt={user.full_name}
            />
            <span>{user.full_name}</span>
          </UserAvatar>
        </div>
      ))}
    </aside>
  );
}

export default UserSidebar;
