import styled from 'styled-components';

import { useChatSession } from './useChatSession';
import MessageUser from './MessageUser';
import UserSidebar from './UserSidebar';
import ChatBox from '../messages/ChatBox';
import ChatForm from './ChatForm';

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
  // const [receiver, setReceiver] = useState(null);
  // const queryClient = useQueryClient();
  // const { data: currentUser } = useCurrentUserProfile();

  // const { messages, error } = useMessages(currentUser?.id, receiver?.id);
  // const [liveMessages, setLiveMessages] = useState([]);
  // const [combinedMessages, setCombinedMessages] = useState([]);
  // useEffect(() => {
  //   setLiveMessages(messages);
  // }, [messages]);

  // useEffect(() => {
  //   if (messages) {
  //     setCombinedMessages(messages);
  //   }
  // }, [messages]);

  // useEffect(() => {
  //   if (messages && messages.length > 0 && combinedMessages.length === 0) {
  //     setCombinedMessages(messages);
  //   }
  // }, [messages, combinedMessages]);

  // const handleNewRealtimeMessage = useCallback((newMsg) => {
  //   console.log('🔔 New realtime message received:', newMsg);
  //   setCombinedMessages((prev) => [...prev, newMsg]);
  // }, []);
  // useRealtimeMessages(currentUser?.id, receiver?.id, handleNewRealtimeMessage);

  // if (error) return <p>Failed to load messages.</p>;

  // async function handleSendMessage(receiverId, content) {
  //   await sendMessage(currentUser.id, receiverId, content);
  //   queryClient.invalidateQueries(['messages', currentUser.id, receiverId]);

  const {
    currentUser,
    receiver,
    setReceiver,
    combinedMessages,
    handleSendMessage,
    error,
  } = useChatSession();

  if (error) return <p>Failed to load messages.</p>;

  return (
    <StyledMessageLayout>
      <HeaderContainer>
        <MessageUser />
      </HeaderContainer>

      <SidebarContainer>
        <UserSidebar onSelect={(user) => setReceiver(user)} />
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
