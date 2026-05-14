import { useKeycloak } from '@react-keycloak/web';
import { useCallback } from 'react';

export const useAuth = () => {
    const { keycloak, initialized } = useKeycloak();

    return {
        initialized,
        isAuthenticated: keycloak.authenticated ?? false,
        login: useCallback(() => keycloak.login(), [keycloak]),

        register: useCallback(() => keycloak.register(), [keycloak]),

        logout: useCallback(() =>
                keycloak.logout({ redirectUri: window.location.origin }),
            [keycloak]
        ),

        hasRole: useCallback(
            (role) => keycloak.hasRealmRole(role),
            [keycloak]
        ),
        getToken: useCallback(async () => {
            await keycloak.updateToken(60);
            return keycloak.token;
        }, [keycloak]),
    };
};