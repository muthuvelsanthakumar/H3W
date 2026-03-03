import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

export function useUser() {
    const query = useQuery({
        queryKey: ['user-me'],
        queryFn: userService.getMe,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        user: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
