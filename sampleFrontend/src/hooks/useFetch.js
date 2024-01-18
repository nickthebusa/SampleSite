import { useQuery } from "@tanstack/react-query";

import APIService from "../fetching/APIService";


export function useSamples() {

  const samples = useQuery({
    queryKey: ["samples"],
    queryFn: () => APIService.GetSamples()
  })

  if (samples.isLoading) return [];
  else if (samples.isError) return [];

  return [samples?.data?.data];
}


export function useTags() {

  const tags = useQuery({
    queryKey: ["tags"],
    queryFn: () => APIService.GetTags()
  })

  if (tags.isLoading) return [];
  else if (tags.isError) return [];

  return [tags?.data?.data, tags.refetch];
}


export function useUsers() {

  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => APIService.GetUsers()
  })

  if (users.isLoading) return [];
  else if (users.isError) return [];

  return [users?.data?.data];
}


export function useProfiles() {

  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: () => APIService.GetProfiles()
  })

  if (profiles.isLoading) return [];
  else if (profiles.isError) return [];

  return [profiles?.data?.data];
}


export function useProfile(id) {

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => APIService.GetProfile(id),
    enabled: !!id
  })

  if (profile.isLoading) return [];
  else if (profile.isError) return [];

  return [profile?.data?.data, profile.refetch];
}


export function useLoggedUser(id) {

  const loggedUser = useQuery({
    queryKey: ["loggedUser"],
    queryFn: () => APIService.GetProfile(id),
    enabled: !!id
  })

  // if (id === null) return null;
  if (loggedUser.isLoading) return [];
  else if (loggedUser.isError) return [];

  return [loggedUser?.data?.data, loggedUser.refetch];
}


export function useUserSamplesById(id) {

  const samples = useQuery({
    queryKey: ["user-samples"],
    queryFn: () => APIService.GetUserSamplesByUserId(id),
    enabled: !!id,
    refetchOnMount: true,
  })

  if (samples.isLoading) return [[], samples.refetch];
  else if (samples.isError) return [[], samples.refetch];

  return [samples?.data?.data, samples.refetch];
}


export function useUserSavedSamples(id) {

  const samples = useQuery({
    queryKey: ["saved-samples"],
    queryFn: () => APIService.GetUserSavedSamples(id),
    enabled: !!id,
    refetchOnMount: true,
  })

  if (samples.isLoading) return [[], samples.refetch];
  else if (samples.isError) return [[], samples.refetch];

  return [samples?.data?.data, samples.refetch];
}