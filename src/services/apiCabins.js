import supabase from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error('cabins could not be loaded');
    throw new Error('cabins could not be loaded');
  }

  return data;
}
