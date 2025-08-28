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

  return data.filter(
    (msg) =>
      (msg.sender_id === senderId && msg.receiver_id === receiverId) ||
      (msg.sender_id === receiverId && msg.receiver_id === senderId)
  );
}

export async function sendMessage(senderId, receiverId, content) {
  const { error } = await supabase.from('messages').insert([
    {
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
    },
  ]);

  if (error) throw new Error('Failed to send message');
}

export async function getUnreadMessageCount(userId) {
  // console.log('Function called with:', userId);
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false);

    // console.log('Supabase response:', { data, error });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Unread message fetch failed:', err);
    throw err;
  }
}
