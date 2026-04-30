import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import LoaderManager from "../../features/Loading/LoaderManager.jsx";

export default function LazyWrapper({ children }) {
    return (
        <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <LoaderManager fullScreen={true}/>
            </Box>
        }>
            {children}
        </Suspense>
    );
}