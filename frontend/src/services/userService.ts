import api from './api';

export interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    is_superuser: boolean;
    organization_id: number;
}

export const userService = {
    getMe: async (): Promise<User> => {
        const response = await api.get('/login/me');
        return response.data;
    },
};
