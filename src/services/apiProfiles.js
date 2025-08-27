import supabase from './supabase';

export async function getAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) {
    console.error('profiles could not be loaded');
    throw new Error('profiles could not be loaded');
  }

  return data;
}

export async function getAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Failed to fetch auth user');
  return user;
}

// export function useCurrentUserProfile() {
//   return useQuery({
//     queryKey: ['currentUser'],
//     queryFn: async () => {
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();
//       if (authError) throw new Error('Failed to fetch auth user');

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (profileError) throw new Error('Failed to fetch profile');

//       return { ...user, ...profile };
//     },
//   });
// }

export async function getUserProfile({ queryKey }) {
  const [, userId] = queryKey;

  if (!userId) throw new Error('No user ID provided');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) throw new Error('Failed to fetch profile');
  return data;
}
