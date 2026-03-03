import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

export function useDataSources() {
    const queryClient = useQueryClient();

    const sourcesQuery = useQuery({
        queryKey: ['dataSources'],
        queryFn: dataService.getSources,
    });

    const uploadMutation = useMutation({
        mutationFn: (file: File) => dataService.uploadFile(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dataSources'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => dataService.deleteSource(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dataSources'] });
        },
    });

    const updateSettingsMutation = useMutation({
        mutationFn: ({ id, settings }: { id: number, settings: any }) => dataService.updateSourceSettings(id, settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dataSources'] });
        },
    });

    return {
        sources: sourcesQuery.data ?? [],
        isLoading: sourcesQuery.isLoading,
        isError: sourcesQuery.isError,
        upload: uploadMutation.mutate,
        isUploading: uploadMutation.isPending,
        remove: deleteMutation.mutate,
        calibrate: updateSettingsMutation.mutate,
        isCalibrating: updateSettingsMutation.isPending,
    };
}
