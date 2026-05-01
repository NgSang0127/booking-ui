import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Loader from "../features/Loading/Loader.jsx"; // Đường dẫn đến component Loader của bạn

const ProtectedRoute = ({ allowedRoles }) => {
    const { initialized, isAuthenticated, hasRole, login } = useAuth();

    // Khung bao dùng chung để căn giữa Loader tuyệt đối
    const FullScreenLoader = ({ message }) => (
        <Box
            sx={{
                position: 'fixed',
                inset: 0, // Phủ kín toàn bộ màn hình
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
                zIndex: 9999,
            }}
        >
            <Box sx={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader />
            </Box>

            {message && (
                <Typography
                    variant="h6"
                    sx={{
                        mt: 4,
                        fontWeight: 700,
                        color: '#111827',
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.05em'
                    }}
                >
                    {message.toUpperCase()}
                </Typography>
            )}
        </Box>
    );

    if (!initialized) {
        return <FullScreenLoader message="Đang khởi tạo hệ thống" />;
    }

    if (!isAuthenticated) {
        login();
        return <FullScreenLoader message="Đang kết nối Keycloak" />;
    }

    const userHasAccess = allowedRoles.some(role => hasRole(role));

    if (!userHasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;