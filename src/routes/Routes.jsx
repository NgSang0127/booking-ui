import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import LazyWrapper   from '../components/common/LazyWrapper.jsx';
import Unauthorized  from '../components/error/Unauthorized.jsx';
import NotFound      from '../components/error/NotFound.jsx';

import adminRoutes    from './adminRoutes.jsx';
import clinicRoutes   from './clinicRoutes.jsx';
import customerRoutes from './customerRoutes.jsx';
import RootLayout from "../App.jsx";

const Auth = lazy(() => import('../features/Auth/Auth.jsx'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { path: 'login',        element: <LazyWrapper><Auth /></LazyWrapper> },
            { path: 'register',     element: <LazyWrapper><Auth isRegister /></LazyWrapper> },
            { path: 'unauthorized', element: <Unauthorized /> },

            adminRoutes,
            clinicRoutes,
            customerRoutes,

            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;