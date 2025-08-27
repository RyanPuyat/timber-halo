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
  // Step 1: Fetch the authenticated user
  const {
    data: authUser,
    isLoading: AuthLoading,
    error: authError,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
  });

  // Step 2: Fetch the full profile using the auth user's ID
  const userId = authUser?.id;

  const {
    data,
    isPending: ProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: getUserProfile,
    enabled: !!userId, // only run when userId is available
  });

  // Combine loading and error states
  const isLoading = AuthLoading || ProfileLoading;
  const error = authError || profileError;

  return {
    data,
    isLoading,
    error,
  };
}
