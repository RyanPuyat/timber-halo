import styled from 'styled-components';
import MessageUser from './MessageUser';
import UserSidebar from './UserSidebar';
import ChatBox from '../messages/ChatBox';
import ChatForm from './ChatForm';
import { markMessagesAsRead } from '../../services/apiMessage';
import { useChatSession } from './useChatSession';
import { useUnreadMessages } from '../../context/UnreadMessageContext';
// import { NotificationBadge } from '../../ui/NotificationBadge';
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
    // combinedMessages,

    messages,
    handleSendMessage,
    file,
    error,
  } = useChatSession();

  const { unreadCounts, resetUnread, receiverId, setReceiverId } =
    useUnreadMessages();

  // function handleUserSelect(user) {
  //   // console.log('Before reset:', unreadCounts);
  //   setReceiverId(user.id);
  //   resetUnread(user.id);
  //   // console.log('Selected user:', user);
  //   // console.log('After reset:', unreadCounts);
  //   setReceiver(user);
  // }

  async function handleUserSelect(user) {
    setReceiverId(user.id);
    setReceiver(user);

    try {
      await markMessagesAsRead(user.id, currentUser.id); // backend update
      resetUnread(user.id); // local context update
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }

  useEffect(() => {
    return () => {
      setReceiverId(null); // Reset when leaving the page
    };
  }, []);

  if (error) return <p>Failed to load messages.</p>;

  return (
    <StyledMessageLayout>
      <HeaderContainer>
        <MessageUser />
      </HeaderContainer>

      <SidebarContainer>
        {/* <NotificationBadge count={unreadCounts} pulse> */}
        <UserSidebar
          onSelect={handleUserSelect}
          unreadCounts={unreadCounts}
          receiverId={receiverId}
        />
        {/* <button onClick={playMessageSound}>Test Sound</button> */}
        {/* </NotificationBadge> */}
      </SidebarContainer>

      <MainContent>
        {receiver ? (
          <ChatBox
            currentUser={currentUser}
            receiver={receiver}
            messages={messages}
            // messages={combinedMessages}
          />
        ) : (
          <p style={{ padding: '2rem' }}>Select a user to start chatting.</p>
        )}
      </MainContent>
      <FooterContainer>
        {receiver && (
          <ChatForm
            onSendMessage={handleSendMessage}
            receiver={receiver}
            file={file}
          />
        )}
      </FooterContainer>
    </StyledMessageLayout>
  );
}

export default MessageLayout;
