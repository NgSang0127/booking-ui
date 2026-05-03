import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailIcon from '@mui/icons-material/Mail';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';

const BecomePartnerFormStep2 = ({ formik }) => {
    // Style chung cho các TextField
    const inputSx = {
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
                    Clinic Address
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Cung cấp địa chỉ và thông tin liên lạc chính xác để khách hàng dễ dàng tìm đến bạn.
                </p>
            </div>

            {/* Sử dụng Tailwind Grid để đảm bảo chia cột chính xác tuyệt đối */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Số điện thoại - Chiếm 1 cột */}
                <div>
                    <TextField
                        fullWidth
                        name="clinicAddress.phoneNumber"
                        label="Số điện thoại di động"
                        placeholder="VD: 0901234567"
                        value={formik.values?.clinicAddress?.phoneNumber || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.clinicAddress?.phoneNumber &&
                            Boolean(formik.errors.clinicAddress?.phoneNumber)
                        }
                        helperText={
                            formik.touched.clinicAddress?.phoneNumber &&
                            formik.errors.clinicAddress?.phoneNumber
                        }
                        sx={inputSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneOutlinedIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {/* Email - Chiếm 1 cột (sẽ nằm ngang với SĐT trên màn hình lớn) */}
                <div>
                    <TextField
                        fullWidth
                        name="clinicAddress.email"
                        label="Email liên hệ"
                        placeholder="VD: contact@phongkham.com"
                        value={formik.values?.clinicAddress?.email || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.clinicAddress?.email &&
                            Boolean(formik.errors.clinicAddress?.email)
                        }
                        helperText={
                            formik.touched.clinicAddress?.email &&
                            formik.errors.clinicAddress?.email
                        }
                        sx={inputSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {/* Địa chỉ chi tiết - Dùng col-span-2 để TRƯỜNG DÀI CHIẾM FULL BỀ NGANG */}
                <div className="md:col-span-2">
                    <TextField
                        fullWidth
                        name="clinicAddress.address"
                        label="Địa chỉ chi tiết (Số nhà, Tòa nhà, Tên đường)"
                        placeholder="VD: 123 Đường Lê Lợi, Phường Bến Nghé"
                        value={formik.values?.clinicAddress?.address || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.clinicAddress?.address &&
                            Boolean(formik.errors.clinicAddress?.address)
                        }
                        helperText={
                            formik.touched.clinicAddress?.address &&
                            formik.errors.clinicAddress?.address
                        }
                        sx={inputSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <HomeOutlinedIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {/* Thành phố - Chiếm 1 cột */}
                <div>
                    <TextField
                        fullWidth
                        name="clinicAddress.city"
                        label="Thành phố / Tỉnh"
                        placeholder="VD: Hồ Chí Minh"
                        value={formik.values?.clinicAddress?.city || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.clinicAddress?.city &&
                            Boolean(formik.errors.clinicAddress?.city)
                        }
                        helperText={
                            formik.touched.clinicAddress?.city &&
                            formik.errors.clinicAddress?.city
                        }
                        sx={inputSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationCityOutlinedIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                {/* Mã Pincode - Chiếm 1 cột */}
                <div>
                    <TextField
                        fullWidth
                        name="clinicAddress.pincode"
                        label="Mã bưu chính (Pincode)"
                        placeholder="VD: 700000"
                        value={formik.values?.clinicAddress?.pincode || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.clinicAddress?.pincode &&
                            Boolean(formik.errors.clinicAddress?.pincode)
                        }
                        helperText={
                            formik.touched.clinicAddress?.pincode &&
                            formik.errors.clinicAddress?.pincode
                        }
                        sx={inputSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PinDropOutlinedIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

            </div>
        </Box>
    );
};

export default BecomePartnerFormStep2;