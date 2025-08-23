import { useQuery } from '@tanstack/react-query';
import { getAllProfiles } from '../../services/apiProfiles';
import supabase from '../../services/supabase';

export function useAllUsers() {
  const {
    isPending,
    data: profiles,
    error,
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: getAllProfiles,
  });

  return { isPending, profiles, error };
}

export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw new Error('Failed to fetch auth user');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw new Error('Failed to fetch profile');

      return { ...user, ...profile };
    },
  });
}
