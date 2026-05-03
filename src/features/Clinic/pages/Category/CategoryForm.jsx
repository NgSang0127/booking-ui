import React, { useState } from "react";
import { useFormik } from "formik";
import { CircularProgress } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useDispatch } from "react-redux";
import { useCreateCategoryMutation } from "../../../../redux/Category/categoryApi";
import { showSnackbar } from "../../../../redux/uiSlice";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary.js";

/* ── Field wrapper ── */
const Field = ({ label, required, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            {label}{required && <span className="text-red-400 ml-0.5 normal-case tracking-normal">*</span>}
        </label>
        {children}
    </div>
);

const CategoryForm = ({ onSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

    const formik = useFormik({
        initialValues: { name: "", image: "" },
        onSubmit: async (values, { resetForm }) => {
            try {
                await createCategory(values).unwrap();
                dispatch(showSnackbar({ message: "Danh mục đã được tạo thành công!", severity: "success" }));
                resetForm();
                if (onSuccess) onSuccess();
            } catch (error) {
                dispatch(showSnackbar({
                    message: error?.data?.message || "Không thể tạo danh mục. Vui lòng thử lại!",
                    severity: "error"
                }));
            }
        },
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            formik.setFieldValue("image", url);
        } catch {
            dispatch(showSnackbar({ message: "Lỗi khi tải ảnh lên!", severity: "error" }));
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const isDisabled = isCreating || isUploading || !formik.values.name || !formik.values.image;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100
                                flex items-center justify-center text-blue-600">
                    <CategoryOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-gray-900">Thêm danh mục mới</h2>
                    <p className="text-xs text-gray-400">Điền thông tin để tạo nhóm dịch vụ</p>
                </div>
            </div>

            <div className="border-t border-gray-50" />

            <form onSubmit={formik.handleSubmit} className="space-y-5">

                {/* Image upload */}
                <Field label="Ảnh minh họa" required>
                    <div className="flex items-start gap-4">
                        {formik.values.image ? (
                            <div className="relative group flex-shrink-0">
                                <img
                                    src={formik.values.image}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-2xl border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => formik.setFieldValue("image", "")}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white
                                               flex items-center justify-center shadow-sm
                                               hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <CloseIcon sx={{ fontSize: 13 }} />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="catImage" className="cursor-pointer flex-shrink-0">
                                <input
                                    type="file" id="catImage" hidden accept="image/*"
                                    onChange={handleImageChange} disabled={isUploading}
                                />
                                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200
                                                bg-gray-50 hover:border-blue-300 hover:bg-blue-50
                                                flex flex-col items-center justify-center gap-1.5
                                                transition-all group">
                                    {isUploading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-[9px] text-blue-400">Đang tải...</span>
                                        </>
                                    ) : (
                                        <>
                                            <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 22, color: "#9ca3af" }} />
                                            <span className="text-[9px] font-semibold text-gray-400 group-hover:text-blue-500 transition-colors">TẢI ẢNH</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        )}
                        <p className="text-xs text-gray-400 leading-relaxed pt-1">
                            Hỗ trợ JPG, PNG, WEBP.<br />
                            Tối đa 2MB. Ảnh sẽ hiển thị trên trang khách hàng.
                        </p>
                    </div>
                </Field>

                {/* Name */}
                <Field label="Tên danh mục" required>
                    <input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder="VD: Khám tổng quát, Răng hàm mặt..."
                        disabled={isCreating}
                        className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl
                                   py-2.5 px-4 placeholder:text-gray-300
                                   focus:outline-none focus:border-blue-400 focus:bg-white
                                   hover:border-gray-300 disabled:opacity-60 transition-all"
                    />
                </Field>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white
                               bg-primary-color hover:opacity-90 active:scale-[0.98]
                               disabled:opacity-50 disabled:pointer-events-none
                               py-2.5 rounded-xl transition-all"
                >
                    {isCreating ? (
                        <><CircularProgress size={14} sx={{ color: "white" }} /> Đang tạo...</>
                    ) : (
                        <><CheckOutlinedIcon sx={{ fontSize: 16 }} /> Tạo danh mục</>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;