import React from 'react';
import { Box } from "@mui/material";
import Loader from "../../features/Loading/Loader.jsx";

const LoadingManager = ({ fullScreen = false, size = 1 }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ...(fullScreen ? {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                } : {
                    width: '100%',
                    height: '100%',
                    transform: `scale(${size})`,
                })
            }}
        >
            <Loader />
        </Box>
    );
};

export default LoadingManager;