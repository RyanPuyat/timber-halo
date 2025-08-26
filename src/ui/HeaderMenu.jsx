import styled from 'styled-components';
import Logout from '../features/authentication/Logout';
import ButtonIcon from './ButtonIcon';
import { HiOutlineUser } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { HiOutlineMail } from 'react-icons/hi';
import UnreadMessageBadge from '../features/messages/UnreadMessageBadge';
import { useState } from 'react';

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

function HeaderMenu() {
  const navigate = useNavigate();

  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate('/account')}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <MessageIcon
          onClick={() => {
            navigate('/messages');
          }}
        >
          <HiOutlineMail />
          <UnreadMessageBadge />
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
