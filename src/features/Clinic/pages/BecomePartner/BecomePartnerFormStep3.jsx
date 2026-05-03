import React, { useState } from "react";
import { Box, IconButton, Stack, TextField, InputAdornment, Typography } from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import StorefrontIcon from '@mui/icons-material/Storefront';
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary.js";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const BecomePartnerFormStep3 = ({ formik }) => {
    const [uploadImage, setUploadingImage] = useState(false);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const image = await uploadToCloudinary(file);
            formik.setFieldValue("clinicDetails.images", [
                ...(formik.values.clinicDetails?.images || []),
                image,
            ]);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...formik.values.clinicDetails.images];
        updatedImages.splice(index, 1);
        formik.setFieldValue("clinicDetails.images", updatedImages);
    };

    // Style chung cho các TextField và Picker
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
                    Clinic Details
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Cung cấp thông tin và hình ảnh về phòng khám của bạn để thu hút khách hàng.
                </p>
            </div>

            <Stack spacing={4}>
                {/* Image Upload Section */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                        Hình ảnh phòng khám
                    </Typography>
                    <div className="flex flex-wrap gap-4 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />

                        <label className="relative" htmlFor="fileInput">
                            <span className="w-28 h-28 cursor-pointer flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#00a68c] hover:bg-gray-50 transition-all">
                                <AddPhotoAlternate className="text-gray-400 mb-1" fontSize="large" />
                                <span className="text-xs text-gray-500 font-medium text-center">Tải ảnh lên</span>
                            </span>
                            {uploadImage && (
                                <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-xl">
                                    <LoaderManager fullScreen={false}/>
                                </div>
                            )}
                        </label>

                        {formik.values?.clinicDetails?.images?.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    className="w-28 h-28 object-cover rounded-xl shadow-sm border border-gray-100"
                                    src={image}
                                    alt={`Clinic ${index + 1}`}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-start justify-end p-1">
                                    <IconButton
                                        onClick={() => handleRemoveImage(index)}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': { bgcolor: 'white' }
                                        }}
                                    >
                                        <Close fontSize="small" color="error" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>

                {/* Clinic Name Field */}
                <TextField
                    fullWidth
                    name="clinicDetails.name"
                    label="Tên phòng khám"
                    placeholder="VD: Nha khoa Nụ Cười Xinh"
                    value={formik.values.clinicDetails?.name || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.clinicDetails?.name &&
                        Boolean(formik.errors.clinicDetails?.name)
                    }
                    helperText={
                        formik.touched.clinicDetails?.name &&
                        formik.errors.clinicDetails?.name
                    }
                    sx={inputSx}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <StorefrontIcon className="text-gray-400" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Operating Hours Section */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <TimePicker
                            label="Giờ mở cửa"
                            value={formik.values.clinicDetails?.openTime || null}
                            onChange={(newValue) => {
                                formik.setFieldValue("clinicDetails.openTime", newValue);
                            }}
                            sx={{ flex: 1, ...inputSx }}
                        />

                        <TimePicker
                            label="Giờ đóng cửa"
                            value={formik.values.clinicDetails?.closeTime || null}
                            onChange={(newValue) => {
                                formik.setFieldValue("clinicDetails.closeTime", newValue);
                            }}
                            sx={{ flex: 1, ...inputSx }}
                        />
                    </Stack>
                </LocalizationProvider>
            </Stack>
        </Box>
    );
};

export default BecomePartnerFormStep3;