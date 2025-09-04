import styled from 'styled-components';
import Menus from '../../ui/Menus';
import { HiDownload, HiTrash } from 'react-icons/hi';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Modal from '../../ui/Modal';

const Avatar = styled.img`
  display: block;
  height: 4rem;
  width: 4rem;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
  margin-right: 8px;
`;

const MessageRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $isSender }) =>
    $isSender ? 'flex-end' : 'flex-start'};
  margin-bottom: 12px;
`;

const MessageActions = styled.div`
  order: ${({ $isSender }) => ($isSender ? 0 : 2)};
  margin: 8px 12px;
  display: flex;
  align-items: center;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: ${({ $isSender, $isDarkMode }) =>
    $isDarkMode
      ? $isSender
        ? 'var(--color-yellow-700)'
        : 'var(--color-green-700)'
      : ''};
  color: var(--color-grey-100);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SenderName = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const MessageText = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden;
  max-width: 100%;
  font-size: 14px;
`;

const MessageFile = styled.div`
  max-width: 200px;
  border-radius: 8px;
  margin-top: 8px;
`;

const Seen = styled.span`
  display: block;
  font-size: 1rem;
  color: ${({ $isDarkMode }) => ($isDarkMode ? 'var(--color-grey-500)' : '')};
  margin-top: 4px;
`;

function MessageItem({
  msg,
  isSender,
  sender,
  isDarkMode,
  isDeleting,
  deleteMessage,
}) {
  return (
    <MessageRow $isSender={isSender}>
      {!isSender && (
        <Avatar
          src={sender.avatar_url || '/default-user.jpg'}
          alt={sender.name}
        />
      )}

      <MessageActions $isSender={isSender}>
        <Modal>
          <Menus>
            <Menus.Toggle id={`msg-${msg.id}`} />
            <Menus.List id={`msg-${msg.id}`}>
              {msg.file_url && (
                <Menus.Button
                  icon={<HiDownload />}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = msg.blobUrl;
                    link.download = msg.file_name;
                    link.click();
                  }}
                >
                  Download File
                </Menus.Button>
              )}
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="messages"
                disabled={isDeleting}
                onConfirm={(onCloseModal) => {
                  deleteMessage(
                    { id: msg.id, filePath: msg.file_url },
                    { onSuccess: onCloseModal }
                  );
                }}
              />
            </Modal.Window>
          </Menus>
        </Modal>
      </MessageActions>

      <MessageBubble $isSender={isSender} $isDarkMode={isDarkMode}>
        <SenderName>{sender.name}</SenderName>
        <MessageText>{msg.content}</MessageText>
        {msg.file_url && (
          <MessageFile>
            <img src={msg.file_url} alt={msg.file_name} />
          </MessageFile>
        )}
        {isSender && msg.read_at && (
          <Seen>Seen at {new Date().toLocaleTimeString()}</Seen>
        )}
      </MessageBubble>
    </MessageRow>
  );
}
export default MessageItem;
