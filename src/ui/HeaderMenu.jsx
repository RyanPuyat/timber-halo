import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import ButtonIcon from './ButtonIcon';
import { HiOutlineUser } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { HiOutlineMail } from 'react-icons/hi';

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

const MessageIcon = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:hover {
    color: var(--color-brown-500);
  }

  & svg {
    width: 2.5rem;
    height: 2.5rem;
    color: var(--color-brown-600);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 25px;
  right: 2.5px;
  background-color: var(--color-brown-100);
  color: var(--color-red-700);
  font-size: 1rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 999px;
  box-shadow: 0 0 0 2px var(--color-grey-0); /* Optional border ring*/

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

function HeaderMenu() {
  const navigate = useNavigate();
  const unreadCount = 100;

  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate('/account')}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <MessageIcon onClick={() => navigate('/messages')}>
          <HiOutlineMail />
          {unreadCount > 0 && (
            <NotificationBadge>
              {unreadCount > 99 ? '99+' : unreadCount}
            </NotificationBadge>
          )}
        </MessageIcon>
      </li>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
