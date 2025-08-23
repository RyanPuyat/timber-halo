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
    },
  ]);

  if (error) throw new Error('Failed to send message');
}
