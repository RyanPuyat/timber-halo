import { useUser } from '../authentication/useUser';
import styled from 'styled-components';

const MessageUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
  padding: 1rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const MessageAvatar = styled.img`
  display: block;
  height: 4rem;
  width: 4rem;
  /* aspect-ratio: 1; */
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function MessageUser() {
  const { user } = useUser();
  const { fullName, avatar } = user.user_metadata;
  return (
    <MessageUserAvatar>
      <MessageAvatar
        src={avatar || '/default-user.jpg'}
        alt={`Avatar of ${fullName}`}
      />
      <span>{fullName}</span>
    </MessageUserAvatar>
  );
}

export default MessageUser;
