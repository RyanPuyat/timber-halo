import supabase from '../services/supabase';
import { createContext, useContext, useState, useEffect } from 'react';
import { getUnreadMessageCount } from '../services/apiMessage';

const UnreadMessageContext = createContext();

function UnreadMessageProvider({ children }) {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeUserId, setActiveUserId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  useEffect(() => {
    async function hydrateUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setActiveUserId(session.user.id);
      }
    }

    hydrateUser();
  }, []);

  useEffect(() => {
    console.log('Active user ID:', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    async function fetchUnread() {
      if (!activeUserId) return;

      try {
        const countsBySender = await getUnreadMessageCount(activeUserId);
        setUnreadCounts(countsBySender); // overwrite with correct structure
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      }
    }

    fetchUnread();
  }, [activeUserId]);

  function incrementUnread(senderId) {
    setUnreadCounts((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1,
    }));
  }

  function resetUnread(userId) {
    // console.log(`Resetting unread for ${userId}`);
    setUnreadCounts((prev) => {
      if (prev[userId] === 0) return prev; // no change needed
      return {
        ...prev,
        [userId]: 0,
      };
    });
  }

  return (
    <UnreadMessageContext.Provider
      value={{
        unreadCounts,
        incrementUnread,
        resetUnread,
        activeUserId,
        setActiveUserId,
        receiverId,
        setReceiverId,
      }}
    >
      {children}
    </UnreadMessageContext.Provider>
  );
}

function useUnreadMessages() {
  const context = useContext(UnreadMessageContext);
  if (context === undefined) throw new Error('Error USeUnreadMEssage Context');
  return context;
}

export { UnreadMessageProvider, useUnreadMessages };
