import api from './api';

export interface DataSource {
    id: number;
    name: string;
    source_type: string;
    health_score: number;
    quality_report: any;
    created_at: string;
    settings?: {
        missing_threshold: number;
        duplicate_threshold: number;
        sensitivity: string;
    };
}

export const dataService = {
    getSources: async (): Promise<DataSource[]> => {
        const response = await api.get('/data/sources');
        return response.data;
    },

    uploadFile: async (file: File): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/data/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteSource: async (id: number): Promise<any> => {
        const response = await api.delete(`/data/${id}`);
        return response.data;
    },

    updateSourceSettings: async (id: number, settings: any): Promise<any> => {
        const response = await api.patch(`/data/${id}`, { settings });
        return response.data;
    }
};
