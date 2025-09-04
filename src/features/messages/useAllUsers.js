import { useQuery } from '@tanstack/react-query';
import {
  getAllProfiles,
  getAuthUser,
  getUserProfile,
} from '../../services/apiProfiles';

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
  const {
    data: authUser,
    isLoading: AuthLoading,
    error: authError,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
  });

  const userId = authUser?.id;

  const {
    data,
    isPending: ProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: getUserProfile,
    enabled: !!userId,
  });

  const isLoading = AuthLoading || ProfileLoading;
  const error = authError || profileError;

  return {
    data,
    isLoading,
    error,
  };
}
