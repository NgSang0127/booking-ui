import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import reportWebVitals from "./reportWebVitals.js";
import {Provider} from "react-redux";
import {store} from "./redux/store.js";
import {RouterProvider} from "react-router-dom";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import keycloak from "./keycloak/keycloak.js";
import router from "./routes/Routes.jsx";
import LoadingManager from "./features/Loading/LoaderManager.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <ReactKeycloakProvider
                authClient={keycloak}
                initOptions={{
                    onLoad: 'check-sso',
                    pkceMethod: 'S256',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    checkLoginIframe: false
                }}
                LoadingComponent={<LoadingManager fullScreen={true}/>}

            >
                <RouterProvider router={router}/>
                <App/>
            </ReactKeycloakProvider>
        </Provider>
    </StrictMode>
)
reportWebVitals();