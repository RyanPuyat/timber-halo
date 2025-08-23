import supabase from './supabase';

export async function getAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) {
    console.error('profiles could not be loaded');
    throw new Error('profiles could not be loaded');
  }

  return data;
}
