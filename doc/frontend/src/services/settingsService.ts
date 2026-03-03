import api from './api';

export interface OrgSettings {
    id: number;
    name: string;
    settings: {
        verbosity: string;
        conservative: boolean;
        realtime: boolean;
        notifications: boolean;
    };
}

export const settingsService = {
    getOrg: async (): Promise<OrgSettings> => {
        const response = await api.get('/settings/organization');
        return response.data;
    },

    updateOrg: async (data: Partial<OrgSettings>): Promise<OrgSettings> => {
        const response = await api.patch('/settings/organization', data);
        return response.data;
    }
};
