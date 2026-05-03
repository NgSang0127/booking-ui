import { Button, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import BecomePartnerFormStep1 from "./BecomePartnerFormStep1.jsx";
import BecomePartnerFormStep2 from "./BecomePartnerFormStep3.jsx";
import BecomePartnerFormStep3 from "./BecomePartnerFormStep2.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createClinic } from "../../../../redux/Clinic/clinicSlice";
import { showSnackbar } from "../../../../redux/uiSlice";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const steps = ["Chi tiết chủ sở hữu", "Thông tin phòng khám", "Địa chỉ liên hệ"];

const ClinicForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 2. Lấy trạng thái Loading từ Redux Store
    const { isLoading } = useSelector((state) => state.clinic);

    const handleStep = (value) => {
        setActiveStep((prev) => prev + value);
    };

    const getLocalTime = (time) => {
        if (!time) return "";
        // Hỗ trợ cả object Dayjs hoặc Date
        let hour = time.$H ?? time.getHours?.();
        let minute = time.$m ?? time.getMinutes?.();
        let second = time.$s ?? 0;

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            fullName: "",
            password: "",
            clinicAddress: {
                phoneNumber: "",
                pincode: "",
                address: "",
                city: "",
                state: "",
                email: "",
            },
            clinicDetails: {
                name: "",
                openTime: null,
                closeTime: null,
                images: []
            },
        },
        onSubmit: async (values) => {
            const openTime = getLocalTime(values.clinicDetails.openTime);
            const closeTime = getLocalTime(values.clinicDetails.closeTime);

            const ownerDetails = {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                role: "OWNER",
                username: values.email.split("@")[0]
            };

            const clinicDetails = {
                ...values.clinicDetails,
                openTime: openTime,
                closeTime: closeTime,
                ...values.clinicAddress
            };

            // 4. Gọi Thunk createClinic
            try {
                await dispatch(createClinic({ ownerDetails, clinicDetails, navigate })).unwrap();

                // 5. Thông báo thành công qua Global Snackbar
                dispatch(showSnackbar({
                    message: "Chúc mừng! Phòng khám của bạn đã được tạo thành công.",
                    severity: "success"
                }));
            } catch (error) {
                // 6. Xử lý lỗi qua Global Snackbar
                dispatch(showSnackbar({
                    message: error || "Đã có lỗi xảy ra khi tạo phòng khám.",
                    severity: "error"
                }));
            }
        },
    });

    const handleSubmit = () => {
        formik.handleSubmit();
    };

    // Style cho Stepper (Giữ nguyên giao diện đẹp của bạn)
    const stepperSx = {
        '& .MuiStepIcon-root': {
            fontSize: '28px',
            '&.Mui-active': { color: '#00a68c' },
            '&.Mui-completed': { color: '#0088ce' }
        },
        '& .MuiStepLabel-label': {
            fontWeight: 500,
            '&.Mui-active': { color: '#00a68c', fontWeight: 700 },
            '&.Mui-completed': { color: '#0088ce' }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pt-4 pb-16 px-2 md:px-4">
            <Stepper activeStep={activeStep} alternativeLabel sx={stepperSx}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <div className="mt-12 mb-10 min-h-[400px]">
                {activeStep === 0 && <BecomePartnerFormStep1 formik={formik} />}
                {activeStep === 1 && <BecomePartnerFormStep2 formik={formik} />}
                {activeStep === 2 && <BecomePartnerFormStep3 formik={formik} />}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <Button
                    disabled={activeStep === 0 || isLoading}
                    onClick={() => handleStep(-1)}
                    variant="text"
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                    Quay lại
                </Button>

                <div className="flex gap-4">
                    {activeStep < steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={() => handleStep(1)}
                            sx={{
                                borderRadius: '12px',
                                px: 6,
                                py: 1.2,
                                bgcolor: '#00a68c',
                                '&:hover': { bgcolor: '#008e77' }
                            }}
                        >
                            Tiếp tục
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            sx={{
                                borderRadius: '12px',
                                px: 6,
                                py: 1.2,
                                background: 'linear-gradient(to right, #00a68c, #0088ce)',
                                boxShadow: '0 4px 14px rgba(0, 166, 140, 0.4)'
                            }}
                        >
                            {isLoading ? <LoaderManager fullScreen={false} size={0.5}/> : "Xác nhận & Tạo"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClinicForm;