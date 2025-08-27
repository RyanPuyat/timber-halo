import styled from 'styled-components';
import MessageUser from './MessageUser';
import UserSidebar from './UserSidebar';
import ChatBox from '../messages/ChatBox';
import ChatForm from './ChatForm';
import { playMessageSound } from './useSoundAlert';
import { useChatSession } from './useChatSession';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
import { useEffect } from 'react';

const StyledMessageLayout = styled.div`
  display: grid;
  grid-template-areas:
    'header sidebar'
    'main sidebar'
    'footer sidebar'; /* New area for the chat form */
  grid-template-columns: 1fr 26rem;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  border: 1px solid var(--color-grey-200);
  border-radius: 15px;
  box-shadow: var(--shadow-md);
  background-color: var(--color-grey-0);
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
`;

const HeaderContainer = styled.div`
  grid-area: header;
`;

const MainContent = styled.div`
  grid-area: main;
  height: 700px;
  overflow-y: auto;
`;

const SidebarContainer = styled.div`
  grid-area: sidebar;
  border-left: 1px solid var(--color-grey-200);
  padding: 2rem;
`;

const FooterContainer = styled.div`
  grid-area: footer;
  border-top: 1px solid var(--color-grey-200);
  padding: 1rem;
`;

function MessageLayout() {
  const {
    currentUser,
    receiver,
    setReceiver,
    combinedMessages,
    handleSendMessage,
    error,
  } = useChatSession();

  const { unreadCounts, resetUnread } = useUnreadMessages();

  // function handleIncomingMessage(message) {
  //   incrementUnread(message.senderId);
  //   playMessageSound();
  // }

  // useEffect(() => {
  //   console.log('Updated unreadCounts:', unreadCounts);
  // }, [unreadCounts]);

  function handleUserSelect(user) {
    // console.log('Before reset:', unreadCounts);
    resetUnread(user.id);
    // console.log('Selected user:', user);
    // console.log('After reset:', unreadCounts);
    setReceiver(user);
  }

  if (error) return <p>Failed to load messages.</p>;

  return (
    <StyledMessageLayout>
      <HeaderContainer>
        <MessageUser />
      </HeaderContainer>

      <SidebarContainer>
        <UserSidebar onSelect={handleUserSelect} unreadCounts={unreadCounts} />
        <button onClick={playMessageSound}>Test Sound</button>
      </SidebarContainer>

      <MainContent>
        {receiver ? (
          <ChatBox
            currentUser={currentUser}
            receiver={receiver}
            messages={combinedMessages}
          />
        ) : (
          <p style={{ padding: '2rem' }}>Select a user to start chatting.</p>
        )}
      </MainContent>
      <FooterContainer>
        {receiver && (
          <ChatForm onSendMessage={handleSendMessage} receiver={receiver} />
        )}
      </FooterContainer>
    </StyledMessageLayout>
  );
}

export default MessageLayout;
