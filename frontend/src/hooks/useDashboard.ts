import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export function useDashboard() {
    const summaryQuery = useQuery({
        queryKey: ['dashboardSummary'],
        queryFn: dashboardService.getSummary,
        refetchInterval: 30000,
    });

    const performanceQuery = useQuery({
        queryKey: ['dashboardPerformance'],
        queryFn: dashboardService.getPerformance,
        refetchInterval: 30000,
    });

    return {
        summary: summaryQuery.data,
        performance: performanceQuery.data ?? [],
        isLoading: summaryQuery.isLoading || performanceQuery.isLoading,
        isError: summaryQuery.isError || performanceQuery.isError,
        refetch: () => {
            summaryQuery.refetch();
            performanceQuery.refetch();
        }
    };
}
