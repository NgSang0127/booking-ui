import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { CircularProgress } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useDispatch } from "react-redux";
import {
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
} from "../../../../redux/Category/categoryApi";
import { showSnackbar } from "../../../../redux/uiSlice";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary.js";

/* ── Field wrapper ── */
const Field = ({ label, required, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
    </div>
);

const UpdateCategoryForm = ({ categoryId, onClose }) => {
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();

    const { data: categoryData, isLoading: isFetching } = useGetCategoryByIdQuery(categoryId, {
        skip: !categoryId,
    });

    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const formik = useFormik({
        initialValues: { name: "", image: "" },
        onSubmit: async (values) => {
            try {
                await updateCategory({ id: categoryId, category: values }).unwrap();
                dispatch(showSnackbar({ message: "Cập nhật danh mục thành công!", severity: "success" }));
                if (onClose) onClose();
            } catch (error) {
                dispatch(showSnackbar({
                    message: error?.data?.message || "Cập nhật thất bại!",
                    severity: "error"
                }));
            }
        },
    });

    useEffect(() => {
        if (categoryData) {
            formik.setValues({ name: categoryData.name || "", image: categoryData.image || "" });
        }
    }, [categoryData]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            formik.setFieldValue("image", url);
        } catch {
            dispatch(showSnackbar({ message: "Lỗi khi tải ảnh!", severity: "error" }));
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    /* Loading */
    if (isFetching) return (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
            <CircularProgress size={28} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải thông tin...</p>
        </div>
    );

    return (
        <div>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100
                                    flex items-center justify-center text-blue-600">
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Chỉnh sửa danh mục</h3>
                        <p className="text-[11px] text-gray-400">Cập nhật thông tin nhóm dịch vụ</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
                               text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <CloseIcon sx={{ fontSize: 17 }} />
                </button>
            </div>

            {/* Form body */}
            <form onSubmit={formik.handleSubmit}>
                <div className="px-6 py-5 space-y-5">

                    {/* Image — centered */}
                    <Field label="Ảnh minh họa">
                        <div className="flex flex-col items-center gap-3">
                            {formik.values.image ? (
                                <div className="relative group">
                                    <img
                                        src={formik.values.image}
                                        alt="Preview"
                                        className="w-28 h-28 object-cover rounded-2xl border border-gray-200
                                                   group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => formik.setFieldValue("image", "")}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white
                                                   flex items-center justify-center shadow-sm
                                                   hover:bg-red-600 transition-colors"
                                    >
                                        <CloseIcon sx={{ fontSize: 13 }} />
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="updateImg" className="cursor-pointer">
                                    <input
                                        type="file" id="updateImg" hidden accept="image/*"
                                        onChange={handleImageChange} disabled={isUploading}
                                    />
                                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200
                                                    bg-gray-50 hover:border-blue-300 hover:bg-blue-50
                                                    flex flex-col items-center justify-center gap-2
                                                    transition-all group cursor-pointer">
                                        {isUploading ? (
                                            <>
                                                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-[10px] text-blue-400">Đang tải...</span>
                                            </>
                                        ) : (
                                            <>
                                                <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
                                                <span className="text-[10px] font-semibold text-gray-400 group-hover:text-blue-500 transition-colors">
                                                    THAY ẢNH
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </label>
                            )}
                            <p className="text-[10px] text-gray-400 text-center">JPG, PNG, WEBP · Tối đa 2MB</p>
                        </div>
                    </Field>

                    {/* Name */}
                    <Field label="Tên danh mục" required>
                        <input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder="VD: Khám tổng quát..."
                            disabled={isUpdating}
                            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl
                                       py-2.5 px-4 placeholder:text-gray-300
                                       focus:outline-none focus:border-blue-400 focus:bg-white
                                       hover:border-gray-300 disabled:opacity-60 transition-all"
                        />
                    </Field>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdating}
                        className="flex-1 text-sm font-medium text-gray-600 border border-gray-200 bg-white
                                   hover:bg-gray-50 hover:text-gray-800
                                   py-2.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isUpdating || isUploading || !formik.values.name}
                        className="flex-1 flex items-center justify-center gap-2
                                   text-sm font-semibold text-white bg-primary-color
                                   hover:opacity-90 active:scale-[0.98]
                                   py-2.5 rounded-xl transition-all
                                   disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isUpdating ? (
                            <><CircularProgress size={14} sx={{ color: "white" }} /> Đang lưu...</>
                        ) : (
                            <><SaveOutlinedIcon sx={{ fontSize: 15 }} /> Lưu thay đổi</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCategoryForm;