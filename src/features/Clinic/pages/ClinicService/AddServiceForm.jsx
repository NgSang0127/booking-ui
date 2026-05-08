import React, {useState} from "react";
import {useFormik} from "formik";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {useDispatch, useSelector} from "react-redux";
import {useCreateServiceMutation} from "../../../../redux/ClinicService/clinicServiceApi";
import {useGetCategoriesByClinicQuery} from "../../../../redux/Category/categoryApi";
import {showSnackbar} from "../../../../redux/uiSlice";
import {uploadToCloudinary} from "../../../../util/uploadToCloudinary.js";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

/* ── Reusable field wrapper ── */
const Field = ({ label, icon, required, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {icon && <span className="text-gray-300">{icon}</span>}
            {label}
            {required && <span className="text-red-400 normal-case tracking-normal">*</span>}
        </label>
        {children}
    </div>
);

/* ── Input base styles ── */
const inputCls = `w-full text-sm text-gray-800 bg-gray-50 border border-gray-200
    rounded-xl py-2.5 px-4 placeholder:text-gray-300
    focus:outline-none focus:border-blue-400 focus:bg-white
    hover:border-gray-300 transition-all`;

const ServiceForm = ({ onSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const dispatch  = useDispatch();

    const currentClinic = useSelector((s) => s.clinic.currentClinic);

    const { data: categories = [], isLoading: isLoadingCategories } =
        useGetCategoriesByClinicQuery(currentClinic?.id, { skip: !currentClinic?.id });

    const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

    const formik = useFormik({
        initialValues: { name: "", description: "", price: "", duration: "", image: "", categoryId: "" },
        onSubmit: async (values, { resetForm }) => {
            try {
                await createService(values).unwrap();
                dispatch(showSnackbar({ message: "Tạo dịch vụ mới thành công!", severity: "success" }));
                resetForm();
                if (onSuccess) onSuccess();
            } catch (error) {
                dispatch(showSnackbar({ message: error?.data?.message || "Không thể tạo dịch vụ!", severity: "error" }));
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
        }
    };

    const isSubmitDisabled = isCreating || isUploading || !formik.values.name || !formik.values.categoryId || !formik.values.price;

    return (
        <div className="max-w-2xl mx-auto">
            {/* ── Header ── */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Thêm dịch vụ mới</h2>
                <p className="text-sm text-gray-400 mt-0.5">Thiết lập thông tin dịch vụ cho phòng khám của bạn</p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

                    {/* ══ LEFT: Image upload (2 cols) ══ */}
                    <div className="md:col-span-2">
                        <Field label="Ảnh minh họa">
                            {formik.values.image ? (
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                                    <img
                                        src={formik.values.image}
                                        alt="Service"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Remove overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => formik.setFieldValue("image", "")}
                                            className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-xl bg-white
                                                       flex items-center justify-center text-red-500
                                                       hover:bg-red-50 transition-all shadow-md"
                                        >
                                            <CloseIcon sx={{ fontSize: 18 }} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="serviceImage" className="cursor-pointer block">
                                    <input
                                        type="file"
                                        id="serviceImage"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={isUploading}
                                    />
                                    <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200
                                                    bg-gray-50 hover:border-blue-300 hover:bg-blue-50
                                                    flex flex-col items-center justify-center gap-3
                                                    transition-all group">
                                        {isUploading ? (
                                            <>
                                                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-xs text-blue-400 font-medium">Đang tải lên...</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-blue-100
                                                                flex items-center justify-center transition-colors">
                                                    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 24, color: "#9ca3af" }} />
                                                </div>
                                                <div className="text-center px-2">
                                                    <p className="text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                                                        Nhấn để tải ảnh lên
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG tối đa 5MB</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </label>
                            )}
                        </Field>
                    </div>

                    {/* ══ RIGHT: Fields (3 cols) ══ */}
                    <div className="md:col-span-3 flex flex-col gap-4">

                        {/* Category */}
                        <Field
                            label="Danh mục dịch vụ"
                            icon={<CategoryOutlinedIcon sx={{ fontSize: 13 }} />}
                            required
                        >
                            <div className="relative">
                                <select
                                    name="categoryId"
                                    value={formik.values.categoryId}
                                    onChange={formik.handleChange}
                                    disabled={isLoadingCategories}
                                    className={`${inputCls} appearance-none pr-9 disabled:opacity-60`}
                                >
                                    <option value="" disabled>
                                        {isLoadingCategories ? "Đang tải..." : "Chọn danh mục"}
                                    </option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </Field>

                        {/* Name */}
                        <Field
                            label="Tên dịch vụ"
                            icon={<MedicalServicesOutlinedIcon sx={{ fontSize: 13 }} />}
                            required
                        >
                            <input
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                placeholder="VD: Khám tổng quát, Siêu âm..."
                                className={inputCls}
                            />
                        </Field>

                        {/* Price + Duration */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Giá (₫)"
                                icon={<AttachMoneyOutlinedIcon sx={{ fontSize: 13 }} />}
                                required
                            >
                                <input
                                    type="number"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    placeholder="150000"
                                    min="0"
                                    className={inputCls}
                                />
                            </Field>
                            <Field
                                label="Thời lượng (ph)"
                                icon={<AccessTimeOutlinedIcon sx={{ fontSize: 13 }} />}
                                required
                            >
                                <input
                                    type="number"
                                    name="duration"
                                    value={formik.values.duration}
                                    onChange={formik.handleChange}
                                    placeholder="30"
                                    min="1"
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        {/* Description */}
                        <Field
                            label="Mô tả chi tiết"
                            icon={<NotesOutlinedIcon sx={{ fontSize: 13 }} />}
                        >
                            <textarea
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                placeholder="Mô tả ngắn về dịch vụ, quy trình thực hiện..."
                                rows={3}
                                className={`${inputCls} resize-none leading-relaxed`}
                            />
                        </Field>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-gray-100 my-5" />

                {/* ── Footer: preview + submit ── */}
                <div className="flex items-center justify-between gap-4">
                    {/* Live price preview */}
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                        {formik.values.price && (
                            <span className="bg-blue-50 text-blue-700 font-semibold text-xs px-3 py-1.5 rounded-lg">
                                {Number(formik.values.price).toLocaleString("vi-VN")} ₫
                            </span>
                        )}
                        {formik.values.duration && (
                            <span className="bg-gray-100 text-gray-600 font-semibold text-xs px-3 py-1.5 rounded-lg">
                                {formik.values.duration} phút
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="flex items-center gap-2 text-sm font-semibold text-white
                                   bg-primary-color hover:opacity-90 active:scale-[0.98]
                                   disabled:opacity-50 disabled:pointer-events-none
                                   px-6 py-2.5 rounded-xl transition-all"
                    >
                        {isCreating ? (
                            <>
                                <LoaderManager fullScreen={false} size={0.5}/>
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <CheckOutlinedIcon sx={{ fontSize: 16 }} />
                                Xác nhận thêm dịch vụ
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;