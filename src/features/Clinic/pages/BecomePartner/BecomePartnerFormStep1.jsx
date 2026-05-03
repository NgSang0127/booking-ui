import React, { useState } from "react";
import { Box, TextField, InputAdornment, IconButton, Stack } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const BecomePartnerFormStep1 = ({ formik }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const textFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover fieldset': {
                borderColor: '#00a68c',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#00a68c',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#00a68c',
        }
    };

    return (
        <Box className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#0088ce] to-[#00a68c] bg-clip-text text-transparent inline-block pb-1">
                    Owner Details
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Vui lòng cung cấp thông tin cá nhân của bạn để tạo tài khoản quản lý phòng khám.
                </p>
            </div>

            {/* Form Fields: Sử dụng Stack của MUI để đảm bảo khoảng cách luôn chuẩn */}
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    name="fullName"
                    label="Họ và Tên"
                    placeholder="VD: Nguyễn Văn A"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    helperText={formik.touched.fullName && formik.errors.fullName}
                    sx={textFieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon className="text-gray-400" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    name="email"
                    label="Địa chỉ Email"
                    placeholder="VD: nguyenvana@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={textFieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MailIcon className="text-gray-400" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    name="password"
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu của bạn"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={textFieldSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon className="text-gray-400" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff className="text-gray-400" /> : <Visibility className="text-gray-400" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
        </Box>
    );
};

export default BecomePartnerFormStep1;