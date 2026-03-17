import api from './api';

export interface Insight {
    id: number;
    title: string;
    description: string;
    impact_level: string;
    confidence_score: number;
    evidence: any;
    ai_root_cause: string;
    category: string;
    status: string;
    visualization_data?: any[];
    predictive_outlook?: string;
    prescriptive_action?: string;
}

export const insightService = {
    getInsights: async (): Promise<Insight[]> => {
        const response = await api.get('/insights/');
        return response.data;
    },

    dismissInsight: async (id: number): Promise<void> => {
        await api.delete(`/insights/${id}`);
    },

    getExplanation: async (sourceId: number): Promise<string> => {
        const response = await api.post(`/insights/${sourceId}/explain`);
        return response.data.explanation;
    },

    generateInsights: async (): Promise<Insight[]> => {
        const response = await api.post('/insights/generate');
        return response.data;
    },

    executeInsight: async (id: number): Promise<{ message: string }> => {
        const response = await api.post(`/insights/${id}/execute`);
        return response.data;
    }
};
