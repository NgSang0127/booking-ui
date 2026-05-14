import React, {useState, useEffect} from "react";
import {Box, Modal, Snackbar, Alert} from "@mui/material";
import {useSelector} from "react-redux";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

import ProfileFieldCard from "./ProfileFieldCard.jsx";
import {useGetClinicByOwnerQuery, useUpdateClinicMutation} from "../../../../redux/Clinic/clinicApi";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {uploadToCloudinary} from "../../../../util/uploadToCloudinary.js";

/* ── Modal style ── */
export const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {xs: "92%", sm: 480},
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
    outline: "none",
    overflow: "hidden",
};

/* ── Field input component ── */
const FormField = ({label, name, value, onChange, type = "text", icon, placeholder}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {label}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full text-sm text-gray-800 bg-gray-50 border border-gray-200
                           rounded-xl py-2.5 ${icon ? "pl-9 pr-4" : "px-4"}
                           placeholder:text-gray-300
                           focus:outline-none focus:border-blue-400 focus:bg-white
                           hover:border-gray-300 transition-all`}
            />
        </div>
    </div>
);

/* ── Time input ── */
const TimeField = ({label, name, value, onChange}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {label}
        </label>
        <input
            type="time"
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200
                       rounded-xl py-2.5 px-4
                       focus:outline-none focus:border-blue-400 focus:bg-white
                       hover:border-gray-300 transition-all"
        />
    </div>
);

/* ── Toggle field ── */
const ToggleField = ({label, name, value, onChange, description}) => (
    <div className="flex items-center justify-between py-1">
        <div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            {description && <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>}
        </div>
        <button
            type="button"
            onClick={() => onChange({target: {name, value: !value, type: "checkbox"}})}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0
                       ${value ? "bg-blue-500" : "bg-gray-200"}`}
            style={{minWidth: "40px", height: "22px"}}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm
                           transition-transform duration-200
                           ${value ? "translate-x-[18px]" : "translate-x-0"}`}
                style={{width: "18px", height: "18px"}}
            />
        </button>
    </div>
);

/* ── Section header ── */
const SectionHeader = ({label}) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 mb-3">
        {label}
    </p>
);

/* ── Stat badge ── */
const StatBadge = ({value, label, color = "blue"}) => {
    const colors = {
        blue: {bg: "#E6F1FB", text: "#185FA5"},
        green: {bg: "#EAF3DE", text: "#3B6D11"},
        amber: {bg: "#FAEEDA", text: "#854F0B"},
    };
    const c = colors[color] || colors.blue;
    return (
        <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-2">
            <span className="text-lg font-bold" style={{color: c.text}}>{value}</span>
            <span className="text-[10px] text-gray-400 mt-0.5 text-center">{label}</span>
        </div>
    );
};

/* ══════════════════════════════════════════════
   Main Profile Component
══════════════════════════════════════════════ */
const Profile = () => {
    const user = useSelector((s) => s.auth.user);
    const currentClinic = useSelector((s) => s.clinic.currentClinic);
    const clinicFromStore = useSelector((s) => s.clinic.clinic);

    /* Fetch clinic từ owner API */
    const {data: ownerClinicData} = useGetClinicByOwnerQuery();
    const [updateClinic, {isLoading: isSaving}] = useUpdateClinicMutation();

    const clinicData = ownerClinicData || currentClinic || clinicFromStore;

    /* Modal state */
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // "clinicDetails" | "hours" | "images"
    const [formData, setFormData] = useState({});
    const [snack, setSnack] = useState({open: false, msg: "", severity: "success"});

    /* Image upload state */
    const [uploadingIdx, setUploadingIdx] = useState(null); // index đang upload
    const [isSavingImages, setIsSavingImages] = useState(false);
    const [localImages, setLocalImages] = useState([]); // mảng URLs hiện tại trong modal

    /* Sync localImages khi mở modal images */
    const handleOpenImages = () => {
        setLocalImages(clinicData?.images?.filter(Boolean) || []);
        handleOpen("images");
    };

    /* Upload 1 file lên Cloudinary rồi thêm vào localImages */
    const handleImageFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Đánh dấu đang upload ở vị trí cuối cùng của mảng hiện tại
        setUploadingIdx(localImages.length);

        try {
            const url = await uploadToCloudinary(file);
            if (url) {
                // Cập nhật mảng local để hiển thị trên UI Modal
                const updatedImages = [...localImages, url];
                setLocalImages(updatedImages);

                // QUAN TRỌNG: Cập nhật luôn vào formData để đồng bộ dữ liệu tổng
                setFormData(prev => ({
                    ...prev,
                    images: updatedImages
                }));
            }
        } catch (error) {
            setSnack({open: true, msg: "Upload thất bại!", severity: "error"});
        } finally {
            setUploadingIdx(null);
            e.target.value = ""; // Reset input file
        }
    };

    /* Xoá ảnh khỏi localImages */
    const handleRemoveImage = (idx) => {
        setLocalImages((prev) => prev.filter((_, i) => i !== idx));
    };

    /* Lưu danh sách ảnh mới lên server */
    const handleSaveImages = async () => {
        if (!clinicData?.id) return;
        setIsSavingImages(true);
        try {
            // Lọc bỏ các phần tử rỗng (nếu có) trước khi gửi
            const cleanImages = localImages.filter(img => img && img.trim() !== "");

            await updateClinic({
                clinicId: clinicData.id,
                data: {
                    ...formData,
                    images: cleanImages // Gửi mảng ảnh đã được làm sạch
                }
            }).unwrap();

            setSnack({open: true, msg: "Cập nhật ảnh thành công!", severity: "success"});
            handleClose();
        } catch (err) {
            setSnack({open: true, msg: "Lưu thất bại: " + (err.data?.message || ""), severity: "error"});
        } finally {
            setIsSavingImages(false);
        }
    };

    /* Sync form khi clinicData đổi */
    useEffect(() => {
        if (clinicData) {
            setFormData({
                name: clinicData.name || "",
                address: clinicData.address || "",
                phoneNumber: clinicData.phoneNumber || "",
                email: clinicData.email || "",
                city: clinicData.city || "",
                openTime: clinicData.openTime || "",
                closeTime: clinicData.closeTime || "",
                isOpen: clinicData.isOpen ?? true,
                homeService: clinicData.homeService ?? false,
                images: clinicData.images || [],
            });
        }
    }, [clinicData]);

    const handleOpen = (type) => {
        setModalType(type);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        if (!clinicData?.id) return;
        try {
            await updateClinic({clinicId: clinicData.id, data: formData}).unwrap();
            setSnack({open: true, msg: "Cập nhật thành công!", severity: "success"});
            handleClose();
        } catch {
            setSnack({open: true, msg: "Cập nhật thất bại. Vui lòng thử lại.", severity: "error"});
        }
    };
    /* Đưa ảnh lên đầu mảng để làm ảnh bìa */
    const handleSetPrimary = (idx) => {
        setLocalImages((prev) => {
            const newArr = [...prev];
            const selectedImg = newArr.splice(idx, 1)[0]; // Lấy ảnh được chọn ra
            newArr.unshift(selectedImg); // Đưa lên đầu mảng
            return newArr;
        });
    };


    /* Avatar initials */
    const initials = user?.fullName
        ? user.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
        : "CB";

    const images = clinicData?.images?.filter(Boolean) || [];

    /* Time bar width */
    const timeBarWidth = (() => {
        if (!clinicData?.openTime || !clinicData?.closeTime) return "0%";
        const toMin = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + (m || 0);
        };
        const open = toMin(clinicData.openTime);
        const close = toMin(clinicData.closeTime);
        return `${Math.min(100, Math.round(((close - open) / 1440) * 100))}%`;
    })();

    /* ── Render ── */
    return (
        <div className="max-w-5xl mx-auto space-y-5 pb-12">

            {/* ════ 1. Cover + Avatar ════ */}
            <div className="relative">
                <div
                    className="h-48 md:h-60 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 border border-gray-100">
                    {images[0] ? (
                        <img src={images[0]} alt="Cover" className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <LocalHospitalOutlinedIcon sx={{fontSize: 52, color: "#B5D4F4"}}/>
                        </div>
                    )}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-2xl"/>
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-10 left-6">
                    <div
                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{initials}</span>
                    </div>
                </div>

                {/* Edit cover */}
                <button
                    onClick={handleOpenImages}
                    className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium
                               bg-black/30 backdrop-blur-md text-white/90
                               border border-white/20 px-3 py-1.5 rounded-lg
                               hover:bg-black/50 transition-all"
                >
                    <CameraAltOutlinedIcon sx={{fontSize: 14}}/>
                    Đổi ảnh bìa
                </button>
            </div>

            {/* ════ 2. Name + CTA ════ */}
            <div className="pt-10 flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold text-gray-900">
                            {clinicData?.name || "Phòng khám"}
                        </h1>
                        <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full
                                         ${clinicData?.isOpen
                            ? "text-green-700 bg-green-50 border border-green-100"
                            : "text-gray-500 bg-gray-50 border border-gray-100"}`}>
                            <CheckCircleOutlineOutlinedIcon sx={{fontSize: 11}}/>
                            {clinicData?.isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                        </span>
                        {clinicData?.homeService && (
                            <span
                                className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                <HomeOutlinedIcon sx={{fontSize: 11}}/>
                                Khám tại nhà
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        <LocationOnOutlinedIcon sx={{fontSize: 14}}/>
                        {clinicData?.address || "Chưa cập nhật địa chỉ"}
                        {clinicData?.city && ` — ${clinicData.city}`}
                    </p>
                </div>
                <button
                    onClick={() => handleOpen("clinicDetails")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary-color
                               border border-blue-200 hover:border-primary-color
                               bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
                >
                    <EditOutlinedIcon sx={{fontSize: 14}}/>
                    Chỉnh sửa thông tin
                </button>
            </div>

            {/* ════ 3. Main grid ════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── LEFT column ── */}
                <div className="flex flex-col gap-5">

                    {/* Owner card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <SectionHeader label="Chủ sở hữu"/>
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold text-white">{initials}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{user?.fullName || "—"}</p>
                                <p className="text-[11px] text-gray-400">{user?.role?.toUpperCase() || "OWNER"}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <ProfileFieldCard
                                label="Email"
                                value={user?.email}
                                icon={<EmailOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                            />
                            <div className="border-t border-gray-50"/>
                            <ProfileFieldCard
                                label="Vai trò"
                                value={user?.role?.toUpperCase() || "OWNER"}
                                icon={<BadgeOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                            />
                        </div>
                    </div>

                    {/* Giờ hoạt động */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <SectionHeader label="Giờ hoạt động"/>
                            <button
                                onClick={() => handleOpen("hours")}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400
                                           hover:text-primary-color hover:bg-blue-50 transition-colors"
                            >
                                <EditOutlinedIcon sx={{fontSize: 14}}/>
                            </button>
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-green-400"/>
                                    Mở cửa
                                </div>
                                <span className="text-sm font-semibold text-gray-800">
                                    {clinicData?.openTime || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-red-400"/>
                                    Đóng cửa
                                </div>
                                <span className="text-sm font-semibold text-gray-800">
                                    {clinicData?.closeTime || "—"}
                                </span>
                            </div>
                            {clinicData?.openTime && clinicData?.closeTime && (
                                <div className="pt-2">
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                                            style={{width: timeBarWidth}}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[10px] text-gray-400">{clinicData.openTime}</span>
                                        <span className="text-[10px] text-gray-400">{clinicData.closeTime}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <SectionHeader label="Tổng quan"/>
                        <div className="grid grid-cols-3 gap-2">
                            <StatBadge value={images.length} label="Ảnh" color="blue"/>
                            <StatBadge value={clinicData?.isOpen ? "Mở" : "Đóng"} label="Trạng thái"
                                       color={clinicData?.isOpen ? "green" : "amber"}/>
                            <StatBadge value={clinicData?.homeService ? "Có" : "Không"} label="Tại nhà" color="amber"/>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT column ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Ảnh phòng khám */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <SectionHeader label="Hình ảnh phòng khám"/>
                            <button
                                onClick={handleOpenImages}
                                className="flex items-center gap-1 text-xs font-medium text-primary-color
                                           hover:opacity-80 transition-opacity"
                            >
                                <EditOutlinedIcon sx={{fontSize: 13}}/>
                                Quản lý ảnh
                            </button>
                        </div>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2.5">
                                <div
                                    className="col-span-2 row-span-2 rounded-xl overflow-hidden h-52 group cursor-pointer">
                                    <img src={images[0]} alt="Main"
                                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                </div>
                                {images.slice(1, 3).map((src, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden h-[98px] group cursor-pointer">
                                        <img src={src} alt={`Clinic ${i + 2}`}
                                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    </div>
                                ))}
                                {images.length < 3 && Array.from({length: 3 - images.length}).map((_, i) => (
                                    <div
                                        key={`ph-${i}`}
                                        onClick={handleOpenImages}
                                        className="rounded-xl h-[98px] border border-dashed border-gray-200 bg-gray-50
                                                   flex flex-col items-center justify-center gap-1 cursor-pointer
                                                   hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                    >
                                        <CameraAltOutlinedIcon sx={{fontSize: 18, color: "#d1d5db"}}/>
                                        <span className="text-[10px] text-gray-400">Thêm ảnh</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                onClick={handleOpenImages}
                                className="h-52 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50
                                           flex flex-col items-center justify-center gap-3 cursor-pointer
                                           hover:border-blue-300 hover:bg-blue-50 transition-all group"
                            >
                                <div
                                    className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                    <CameraAltOutlinedIcon sx={{fontSize: 24, color: "#9ca3af"}}/>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-500">Chưa có ảnh phòng khám</p>
                                    <p className="text-xs text-primary-color mt-0.5">Nhấn để tải ảnh lên</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Clinic details */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <SectionHeader label="Thông tin phòng khám"/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ProfileFieldCard
                                label="Tên phòng khám"
                                value={clinicData?.name}
                                icon={<LocalHospitalOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                            />
                            <ProfileFieldCard
                                label="Số điện thoại"
                                value={clinicData?.phoneNumber}
                                icon={<PhoneOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                            />
                            <ProfileFieldCard
                                label="Email phòng khám"
                                value={clinicData?.email}
                                icon={<EmailOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                            />
                            <ProfileFieldCard
                                label="Thành phố"
                                value={clinicData?.city}
                                icon={<PublicOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                            />
                            <div className="sm:col-span-2">
                                <ProfileFieldCard
                                    label="Địa chỉ"
                                    value={clinicData?.address}
                                    icon={<LocationOnOutlinedIcon sx={{fontSize: 14, color: "#9ca3af"}}/>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════ Modal chỉnh sửa ════ */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    {/* Modal header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900">
                            {modalType === "clinicDetails" && "Chỉnh sửa thông tin phòng khám"}
                            {modalType === "hours" && "Cập nhật giờ hoạt động"}
                            {modalType === "images" && "Quản lý hình ảnh"}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400
                                       hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <CloseIcon sx={{fontSize: 18}}/>
                        </button>
                    </div>

                    {/* Modal body */}
                    <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

                        {/* Form: clinic details */}
                        {modalType === "clinicDetails" && (
                            <>
                                <FormField
                                    label="Tên phòng khám"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={<LocalHospitalOutlinedIcon sx={{fontSize: 15}}/>}
                                    placeholder="Nhập tên phòng khám"
                                />
                                <FormField
                                    label="Địa chỉ"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    icon={<LocationOnOutlinedIcon sx={{fontSize: 15}}/>}
                                    placeholder="Số nhà, đường, phường..."
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                        label="Thành phố"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        icon={<PublicOutlinedIcon sx={{fontSize: 15}}/>}
                                        placeholder="TP.HCM"
                                    />
                                    <FormField
                                        label="Số điện thoại"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        icon={<PhoneOutlinedIcon sx={{fontSize: 15}}/>}
                                        placeholder="0xxxxxxxxx"
                                    />
                                </div>
                                <FormField
                                    label="Email liên hệ"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<EmailOutlinedIcon sx={{fontSize: 15}}/>}
                                    placeholder="clinic@example.com"
                                />
                                <div className="pt-1 space-y-3 border-t border-gray-50">
                                    <ToggleField
                                        label="Trạng thái mở cửa"
                                        name="isOpen"
                                        value={formData.isOpen}
                                        onChange={handleChange}
                                        description="Cho phép bệnh nhân đặt lịch"
                                    />
                                    <ToggleField
                                        label="Khám tại nhà"
                                        name="homeService"
                                        value={formData.homeService}
                                        onChange={handleChange}
                                        description="Bác sĩ đến tận nhà bệnh nhân"
                                    />
                                </div>
                            </>
                        )}

                        {/* Form: hours */}
                        {modalType === "hours" && (
                            <>
                                <p className="text-sm text-gray-400">Thiết lập giờ mở / đóng cửa hàng ngày.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <TimeField
                                        label="Giờ mở cửa"
                                        name="openTime"
                                        value={formData.openTime}
                                        onChange={handleChange}
                                    />
                                    <TimeField
                                        label="Giờ đóng cửa"
                                        name="closeTime"
                                        value={formData.closeTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <ToggleField
                                    label="Trạng thái mở cửa"
                                    name="isOpen"
                                    value={formData.isOpen}
                                    onChange={handleChange}
                                    description="Bật để nhận lịch hẹn mới"
                                />
                            </>
                        )}

                        {/* Image manager with Cloudinary upload */}
                        {modalType === "images" && (
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400">
                                    Tối đa 6 ảnh. Ảnh đầu tiên sẽ làm ảnh bìa phòng khám.
                                </p>

                                {/* Image grid */}
                                <div className="grid grid-cols-3 gap-2.5">
                                    {localImages.map((src, i) => (
                                        <div key={i}
                                             className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                                            <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover"/>

                                            {/* Overlay khi hover */}
                                            <div
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">

                                                {/* Nút đặt làm ảnh bìa (chỉ hiện nếu không phải ảnh bìa hiện tại) */}
                                                {i !== 0 ? (
                                                    <button
                                                        onClick={() => handleSetPrimary(i)}
                                                        className="text-[10px] font-bold bg-white text-gray-900 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                                    >
                                                        Đặt làm bìa
                                                    </button>
                                                ) : (
                                                    <span
                                                        className="text-[10px] font-bold bg-blue-500 text-white px-2 py-1 rounded-md">
                                                        ĐANG LÀ BÌA
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() => handleRemoveImage(i)}
                                                    className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                                                >
                                                    <DeleteOutlineOutlinedIcon sx={{fontSize: 16, color: "#fff"}}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Upload slot — chỉ hiện nếu chưa đủ 6 ảnh */}
                                    {localImages.length < 6 && (
                                        <label className="relative rounded-xl aspect-square border-2 border-dashed border-gray-200 bg-gray-50
                                                          flex flex-col items-center justify-center gap-1.5 cursor-pointer
                                                          hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleImageFileChange}
                                                disabled={uploadingIdx !== null}
                                            />
                                            {uploadingIdx === localImages.length ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <div
                                                        className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/>
                                                    <span className="text-[10px] text-blue-400">Đang tải...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <AddPhotoAlternateOutlinedIcon sx={{fontSize: 22, color: "#9ca3af"}}
                                                                                   className="group-hover:!text-blue-400 transition-colors"/>
                                                    <span
                                                        className="text-[10px] text-gray-400 group-hover:text-blue-500 transition-colors">Thêm ảnh</span>
                                                </>
                                            )}
                                        </label>
                                    )}
                                </div>

                                {/* Empty state */}
                                {localImages.length === 0 && (
                                    <p className="text-center text-xs text-gray-400 -mt-1">
                                        Chưa có ảnh nào. Nhấn ô trên để tải lên.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modal footer */}
                    <div
                        className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <button
                            onClick={handleClose}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700
                                       px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={modalType === "images" ? handleSaveImages : handleSave}
                            disabled={isSaving || isSavingImages || uploadingIdx !== null}
                            className="flex items-center gap-2 text-sm font-semibold text-white
                                       bg-primary-color hover:opacity-90 disabled:opacity-60
                                       px-5 py-2 rounded-xl transition-opacity"
                        >
                            {modalType === "images"
                                ? <CloudUploadOutlinedIcon sx={{fontSize: 15}}/>
                                : <SaveOutlinedIcon sx={{fontSize: 15}}/>
                            }
                            {(isSaving || isSavingImages)
                                ? "Đang lưu..."
                                : uploadingIdx !== null
                                    ? "Đang upload..."
                                    : modalType === "images" ? "Lưu ảnh" : "Lưu thay đổi"
                            }
                        </button>
                    </div>
                </Box>
            </Modal>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((p) => ({...p, open: false}))}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert severity={snack.severity} sx={{borderRadius: "12px", fontSize: "13px"}}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;