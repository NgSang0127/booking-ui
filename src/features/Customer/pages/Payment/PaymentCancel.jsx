import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const steps = [
    'Thử đặt lịch lại với phương thức thanh toán khác',
    'Kiểm tra lịch hẹn hiện tại của bạn',
    'Liên hệ hỗ trợ nếu cần trợ giúp',
];

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                p: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    maxWidth: 480,
                    width: '100%',
                    borderRadius: 4,
                    border: '1px solid #eee',
                    p: { xs: 3, sm: 5 },
                    textAlign: 'center',
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        backgroundColor: '#FCEBEB',
                        border: '6px solid #F7C1C1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                    }}
                >
                    <Box
                        component="svg"
                        viewBox="0 0 48 48"
                        sx={{ width: 48, height: 48 }}
                    >
                        <circle cx="24" cy="24" r="20" fill="#F7C1C1" />
                        <path
                            d="M16 16 L32 32 M32 16 L16 32"
                            stroke="#A32D2D"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </Box>
                </Box>

                {/* Title */}
                <Typography variant="h5" fontWeight={500} mb={1}>
                    Thanh toán bị hủy
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} lineHeight={1.7}>
                    Giao dịch của bạn chưa được hoàn tất. Không có khoản nào bị trừ khỏi tài khoản của bạn.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Info box */}
                <Box
                    sx={{
                        backgroundColor: '#FAEEDA',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        gap: 1.5,
                        textAlign: 'left',
                        mb: 3,
                    }}
                >
                    <InfoOutlinedIcon sx={{ color: '#BA7517', fontSize: 18, mt: '2px', flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                        Nếu tiền đã bị trừ nhưng đơn hàng không thành công, vui lòng{' '}
                        <Box component="span" fontWeight={500} color="text.primary">liên hệ hỗ trợ</Box>
                        {' '}— chúng tôi hoàn tiền trong vòng{' '}
                        <Box component="span" fontWeight={500} color="text.primary">3–5 ngày làm việc</Box>.
                    </Typography>
                </Box>

                {/* Steps */}
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5, display: 'block' }}
                    >
                        Bạn có thể
                    </Typography>
                    {steps.map((step, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.25 }}>
                            <Box
                                sx={{
                                    width: 28, height: 28,
                                    borderRadius: '50%',
                                    border: '1px solid #ddd',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, color: 'text.secondary', flexShrink: 0,
                                }}
                            >
                                {i + 1}
                            </Box>
                            <Typography variant="body2" color="text.secondary">{step}</Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => navigate('/bookings/new')}
                        sx={{
                            borderRadius: 2,
                            py: 1.25,
                            fontWeight: 500,
                            textTransform: 'none',
                            backgroundColor: '#E24B4A',
                            '&:hover': { backgroundColor: '#A32D2D' },
                            boxShadow: 'none',
                        }}
                    >
                        Thử lại đặt lịch
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CalendarMonthIcon />}
                        onClick={() => navigate('/bookings')}
                        sx={{
                            borderRadius: 2,
                            py: 1.25,
                            fontWeight: 500,
                            textTransform: 'none',
                            borderColor: '#ddd',
                            color: 'text.primary',
                            '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#ccc' },
                        }}
                    >
                        Xem lịch hẹn của tôi
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<SupportAgentIcon />}
                        onClick={() => navigate('/contact')}
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            fontWeight: 400,
                            fontSize: 13,
                            '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
                        }}
                    >
                        Liên hệ hỗ trợ
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentCancel;