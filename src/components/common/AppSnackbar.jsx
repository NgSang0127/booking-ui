import React from 'react';
import { Snackbar, Alert, Slide, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnackbar } from '../../redux/uiSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';


function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

const AppSnackbar = () => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector((state) => state.ui.snackbar);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(hideSnackbar());
    };

    // Tùy chỉnh Icon cho từng loại thông báo
    const icons = {
        success: <CheckCircleIcon fontSize="small" />,
        error: <ErrorIcon fontSize="small" />,
        warning: <WarningAmberOutlinedIcon fontSize="small" />,
        info: <InfoOutlinedIcon fontSize="small" />,
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // 1. Đưa lên góc trên bên phải
            TransitionComponent={TransitionLeft}
            sx={{
                mt: 8, // Cách đỉnh đầu (tránh đè vào Navbar)
                mr: 2,
                maxWidth: '400px'
            }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                icon={icons[severity]}
                sx={{
                    width: '100%',
                    // 2. Giao diện hiện đại
                    borderRadius: '16px', // Bo góc lớn
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)', // Đổ bóng sâu tạo chiều sâu
                    padding: '12px 24px',
                    alignItems: 'center',
                    // Hiệu ứng Glassmorphism nhẹ
                    backdropFilter: 'blur(8px)',
                    backgroundColor: (theme) => {
                        // Làm màu dịu hơn một chút so với màu mặc định của MUI
                        switch (severity) {
                            case 'success': return 'rgba(34, 197, 94, 0.95)';
                            case 'error': return 'rgba(239, 68, 68, 0.95)';
                            case 'warning': return 'rgba(245, 158, 11, 0.95)';
                            default: return 'rgba(59, 130, 246, 0.95)';
                        }
                    },
                    '& .MuiAlert-message': {
                        padding: 0,
                    },
                    '& .MuiAlert-icon': {
                        fontSize: '24px',
                        opacity: 1
                    }
                }}
            >
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                        {severity === 'success' ? 'Thành công' : severity === 'error' ? 'Lỗi hệ thống' : 'Thông báo'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, display: 'block' }}>
                        {message}
                    </Typography>
                </Box>
            </Alert>
        </Snackbar>
    );
};

export default AppSnackbar;