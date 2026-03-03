import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, type OrgSettings } from '../services/settingsService';

export function useSettings() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['settings'],
        queryFn: settingsService.getOrg,
    });

    const mutation = useMutation({
        mutationFn: (data: Partial<OrgSettings>) => settingsService.updateOrg(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
    });

    return {
        settings: query.data,
        isLoading: query.isLoading,
        update: mutation.mutate,
        isUpdating: mutation.isPending,
    };
}
