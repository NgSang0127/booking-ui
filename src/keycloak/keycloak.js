import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url:      import.meta.env.VITE_KEYCLOAK_URL      || 'http://localhost:7080',
    realm:    import.meta.env.VITE_KEYCLOAK_REALM    || 'clinic-booking',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'clinic-booking-react',
});

export default keycloak;