import supabase from './supabase';

export async function getMessages(senderId, receiverId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  const filtered = data.filter(
    (msg) =>
      (msg.sender_id === senderId && msg.receiver_id === receiverId) ||
      (msg.sender_id === receiverId && msg.receiver_id === senderId)
  );

  const enriched = await Promise.all(
    filtered.map(async (msg) => {
      if (msg.file_url) {
        try {
          const res = await fetch(msg.file_url);
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          return { ...msg, blobUrl };
        } catch (err) {
          console.error('Failed to fetch file:', err);
          return msg;
        }
      }
      return msg;
    })
  );

  return enriched;
}

export async function sendMessage(senderId, receiverId, content, file) {
  let fileUrl = null;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`.replaceAll('/', '');
    const { data, error: uploadError } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file);

    if (!data || uploadError) {
      console.error('Upload failed:', uploadError);
      throw new Error('File upload failed');
    }

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName);
    fileUrl = publicUrlData.publicUrl;

    if (!publicUrlData || !publicUrlData.publicUrl || urlError) {
      console.error('Failed to get public URL:', urlError);
      throw new Error('Failed to get public URL');
    }

    fileUrl = publicUrlData.publicUrl;
  }

  console.log('Message payload:', {
    sender_id: senderId,
    receiver_id: receiverId,
    content,
    file_url: fileUrl,
    file_name: file?.name || null,
  });

  const { error } = await supabase.from('messages').insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
      file_url: fileUrl,
      file_name: file?.name || null,
      // created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw new Error('Failed to send message');
}

export async function getUnreadMessageCount(userId) {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      // .select('*', { count: 'exact', head: true })
      .select('sender_id')

      .eq('receiver_id', userId)
      .eq('read', false);

    if (error) throw error;
    // return data;

    const counts = {};
    messages.forEach(({ sender_id }) => {
      counts[sender_id] = (counts[sender_id] || 0) + 1;
    });

    return counts; // e.g. { user2: 1, user3: 1 }
    // return count;
  } catch (err) {
    console.error('Unread message fetch failed:', err);
    throw err;
  }
}

export async function markMessagesAsRead(senderId, receiverId) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('read', false);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to mark messages as read:', err);
    throw err;
  }
}

export async function deleteMessage(id, filePath) {
  // console.log('deleteMessageApi received:', { id, filePath });

  if (!id) {
    throw new Error('Missing id or senderId');
  }

  const { data: MessageData, error: deleteError } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
    .select();

  // console.log('Delete response:', { MessageData, deleteError });

  if (deleteError) {
    throw new Error('Message could not be deleted');
  }

  let fileData = null;

  if (filePath) {
    const { data, error: fileError } = await supabase.storage
      .from('chat-files')
      .remove([filePath]);

    if (fileError) {
      console.warn('File deletion failed:', fileError.message);
    }

    fileData = data;
  }

  return { messageData: MessageData, fileData };
}
