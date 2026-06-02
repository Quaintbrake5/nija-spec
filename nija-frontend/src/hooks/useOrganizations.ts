import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services';
import type { Organization } from '@/types';

export { useOrganization } from '@/stores';

const QUERY_KEY = 'organizations';

interface OrganizationMember {
  userId: string;
  role: string;
  joinedAt: string;
}

export function useOrganizations() {
  return useQuery<Organization[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: () => organizationService.getOrganizations(),
  });
}

export function useOrganizationDetail(orgId: string) {
  return useQuery<Organization, Error>({
    queryKey: [QUERY_KEY, orgId],
    queryFn: () => organizationService.getOrganization(orgId),
    enabled: !!orgId,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation<Organization, Error, { name: string }>({
    mutationFn: (data) => organizationService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateOrganization(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation<Organization, Error, { name?: string }>({
    mutationFn: (data) => organizationService.updateOrganization(orgId, data),
    onSuccess: (updatedOrg) => {
      queryClient.setQueryData([QUERY_KEY, orgId], updatedOrg);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (orgId) => organizationService.deleteOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useOrganizationMembers(orgId: string) {
  return useQuery<OrganizationMember[], Error>({
    queryKey: [QUERY_KEY, orgId, 'members'],
    queryFn: () => organizationService.getOrganizationMembers(orgId),
    enabled: !!orgId,
  });
}

export function useAddOrganizationMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; role: string }>({
    mutationFn: ({ userId, role }) => organizationService.addOrganizationMember(orgId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, orgId, 'members'] });
    },
  });
}

export function useRemoveOrganizationMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (userId) => organizationService.removeOrganizationMember(orgId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, orgId, 'members'] });
    },
  });
}

export function useUpdateMemberRole(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { userId: string; role: string }>({
    mutationFn: ({ userId, role }) => organizationService.updateMemberRole(orgId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, orgId, 'members'] });
    },
  });
}
