import { createContext, useContext, useState } from 'react';

const UnreadMessageContext = createContext();

function UnreadMessageProvider({ children }) {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeUserId, setActiveUserId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

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
