import React, {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Button, Typography} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


import {useProceedPaymentMutation} from "../../../../redux/Payment/paymentApi";
import {showSnackbar} from "../../../../redux/uiSlice";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const PaymentSuccessHandler = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const hasCalledApi = useRef(false);

    // 2. Sử dụng Mutation Hook để xác nhận thanh toán với Backend
    const [proceedPayment, { isLoading, isSuccess, isError }] = useProceedPaymentMutation();

    const getQueryParam = (key) => new URLSearchParams(location.search).get(key);
    const paymentId = getQueryParam("razorpay_payment_id") || getQueryParam("paymentId"); // Hỗ trợ cả 2 params
    const paymentLinkId = getQueryParam("razorpay_payment_link_id") || getQueryParam("paymentLinkId");

    useEffect(() => {
        // Chỉ gọi API một lần duy nhất khi mount
        if (paymentId && !hasCalledApi.current) {
            hasCalledApi.current = true;

            confirmPayment();
        }
    }, [paymentId]);

    const confirmPayment = async () => {
        try {
            // 3. Thực thi mutation xác nhận thanh toán
            await proceedPayment({ paymentId, paymentLinkId }).unwrap();

            dispatch(showSnackbar({
                message: "Thanh toán thành công! Lịch hẹn của bạn đã được xác nhận.",
                severity: "success"
            }));
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.data?.message || "Có lỗi khi xác thực thanh toán. Vui lòng liên hệ hỗ trợ.",
                severity: "error"
            }));
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-gray-50/30 px-5 animate-fade-in">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 w-full max-w-sm text-center space-y-8">

                {/* ── Trạng thái Đang xử lý ── */}
                {isLoading && (
                    <Box sx={{ py: 4, spaceY: 4 }}>
                        <LoaderManager fullScreen={true}/>
                        <Typography variant="h6" fontWeight={800}>Đang xác thực...</Typography>
                        <Typography variant="body2" color="text.secondary">Vui lòng không tắt trình duyệt, chúng tôi đang kiểm tra giao dịch của bạn.</Typography>
                    </Box>
                )}

                {/* ── Trạng thái Lỗi ── */}
                {isError && (
                    <Box sx={{ py: 2 }}>
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                            <Typography variant="h4" color="error">!</Typography>
                        </div>
                        <Typography variant="h5" fontWeight={900} color="error.main" mb={2}>Thanh toán thất bại</Typography>
                        <Typography variant="body2" color="text.secondary" mb={4}>
                            Giao dịch của bạn gặp sự cố hoặc đã bị hủy.
                        </Typography>
                        <Button onClick={() => navigate("/")} fullWidth variant="outlined" sx={{ borderRadius: "16px", py: 1.5 }}>
                            Quay lại trang chủ
                        </Button>
                    </Box>
                )}

                {/* ── Trạng thái Thành công ── */}
                {isSuccess && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center animate-bounce-slow">
                                <CheckCircleIcon sx={{ fontSize: 64, color: "#22c55e" }} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', tracking: -1 }}>
                                Đã xác nhận!
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, px: 2 }}>
                                Chúc mừng! Lịch hẹn của bạn đã được đặt thành công. Chúng tôi đã gửi thông tin chi tiết qua email.
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                onClick={() => navigate("/bookings")}
                                variant="contained"
                                startIcon={<CalendarTodayIcon />}
                                fullWidth
                                sx={{
                                    borderRadius: "16px", py: 1.8, fontWeight: 800, textTransform: "none", fontSize: "1rem",
                                    background: 'linear-gradient(to right, #0088ce, #00a68c)',
                                    boxShadow: '0 8px 24px rgba(0, 136, 206, 0.2)'
                                }}
                            >
                                Xem lịch hẹn của tôi
                            </Button>
                            <Button
                                onClick={() => navigate("/")}
                                variant="text"
                                fullWidth
                                sx={{ borderRadius: "16px", py: 1.2, textTransform: "none", fontWeight: 700, color: 'text.secondary' }}
                            >
                                Quay lại trang chủ
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccessHandler;