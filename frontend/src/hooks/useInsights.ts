import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insightService } from '../services/insightService';

export function useInsights() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['insights'],
        queryFn: insightService.getInsights,
    });

    const dismissMutation = useMutation({
        mutationFn: (id: number) => insightService.dismissInsight(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insights'] });
        },
    });

    const generateMutation = useMutation({
        mutationFn: insightService.generateInsights,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insights'] });
        },
    });

    const executeMutation = useMutation({
        mutationFn: (id: number) => insightService.executeInsight(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insights'] });
        },
    });

    return {
        insights: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        dismiss: dismissMutation.mutate,
        isDismissing: dismissMutation.isPending,
        generate: generateMutation.mutate,
        isGenerating: generateMutation.isPending,
        execute: executeMutation.mutate,
        isExecuting: executeMutation.isPending,
    };
}
