import api from './api';

export interface DashboardSummary {
    business_health: number;
    data_integrity: string;
    total_sources: number;
    critical_risks: number;
    live_insights: number;
}

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummary> => {
        const response = await api.get('/dashboard/summary');
        return response.data;
    },
    getPerformance: async (): Promise<any[]> => {
        const response = await api.get('/dashboard/performance');
        return response.data;
    }
};
