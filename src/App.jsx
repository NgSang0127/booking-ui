import {CssBaseline, ThemeProvider} from '@mui/material';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useGetUserProfileQuery} from "./redux/Auth/authApi";
import {clearUser, setUser} from "./redux/Auth/authSlice";
import blueTheme from "./theme/blueTheme.js";
import AppSnackbar from "./components/common/AppSnackbar.jsx";
import {useKeycloak} from '@react-keycloak/web';
import {Outlet} from 'react-router-dom';

export default function RootLayout() {
    const dispatch = useDispatch();
    const {keycloak, initialized} = useKeycloak();

    console.log("[RootLayout] Keycloak State:", {
        initialized,
        authenticated: keycloak?.authenticated,
        token: keycloak?.token ? "Dã có Token" : "Chưa có Token"
    });

    const {data: userProfile, isSuccess, isLoading, error} = useGetUserProfileQuery(undefined, {
        skip: !initialized || !keycloak.authenticated,
    });

    useEffect(() => {
        if (isLoading) console.log("[RootLayout] API Profile: Loading...");
        if (isSuccess) console.log("[RootLayout] API Profile: Success", userProfile);
        if (error) console.error("[RootLayout] API Profile: Error", error);
    }, [isLoading, isSuccess, error, userProfile]);

    useEffect(() => {
        if (initialized && !keycloak.authenticated) {
            dispatch(clearUser());
        }
    }, [initialized, keycloak.authenticated]);

    useEffect(() => {
        if (isSuccess && userProfile) {
            dispatch(setUser(userProfile));
        }
    }, [isSuccess, userProfile, dispatch]);

    return (
        <ThemeProvider theme={blueTheme}>
            <CssBaseline/>
            <div>
                <Outlet/>
                <AppSnackbar/>
            </div>
        </ThemeProvider>
    );
}