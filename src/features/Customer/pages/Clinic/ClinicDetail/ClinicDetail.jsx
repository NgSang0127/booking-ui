import React from "react";
import {useParams} from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {useGetClinicByIdQuery} from "../../../../../redux/Clinic/clinicApi.js";
import LoaderManager from "../../../../Loading/LoaderManager.jsx";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg";

/* ── Info row ── */
const InfoRow = ({ icon, label, children }) => (
    <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center
                        text-blue-600 flex-shrink-0">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-0.5">{label}</p>
            <div className="text-sm font-medium text-gray-800 leading-snug">{children}</div>
        </div>
    </div>
);

/* ── Section label ── */
const SectionLabel = ({ text }) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-3">{text}</p>
);

const ClinicDetail = () => {
    const { id } = useParams();
    const { data: clinicData, isLoading, isError } = useGetClinicByIdQuery(id, { skip: !id });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LoaderManager fullScreen={true}/>
            <p className="text-sm text-gray-400">Đang tải thông tin phòng khám...</p>
        </div>
    );

    if (isError || !clinicData) return (
        <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm font-medium text-red-500">Không tìm thấy thông tin phòng khám này!</p>
        </div>
    );

    const images = clinicData.images?.filter(Boolean) || [];

    return (
        <div className="space-y-6 mb-16">

            {/* ── Gallery ── */}
            <section className="grid grid-cols-4 grid-rows-2 gap-2.5 h-[340px] rounded-2xl overflow-hidden">
                {/* Main image */}
                <div className="col-span-2 row-span-2 overflow-hidden group">
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={images[0] || FALLBACK_IMAGE}
                        alt={clinicData.name}
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                </div>
                {/* Thumbnails */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="overflow-hidden group">
                        <img
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            src={images[i] || FALLBACK_IMAGE}
                            alt={`${clinicData.name} ${i + 1}`}
                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                        />
                    </div>
                ))}
            </section>

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT: Info (2/3) */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Title card */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                    {clinicData.name}
                                </h1>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                                        <StarIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
                                        <span className="text-xs font-bold text-amber-700">4.8</span>
                                    </div>
                                    <span className="text-xs text-gray-400">120+ đánh giá</span>
                                    {clinicData.isOpen && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold
                                                         text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 10 }} />
                                            Đang mở cửa
                                        </span>
                                    )}
                                    {clinicData.homeService && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold
                                                         text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                            <HomeOutlinedIcon sx={{ fontSize: 10 }} />
                                            Khám tại nhà
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <InfoRow label="Địa chỉ" icon={<LocationOnOutlinedIcon sx={{ fontSize: 16 }} />}>
                                {clinicData.address}{clinicData.city ? `, ${clinicData.city}` : ""}
                            </InfoRow>
                            <InfoRow label="Giờ làm việc" icon={<AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />}>
                                {clinicData.openTime || "—"} – {clinicData.closeTime || "—"}
                            </InfoRow>
                            <InfoRow label="Số điện thoại" icon={<PhoneOutlinedIcon sx={{ fontSize: 16 }} />}>
                                <a href={`tel:${clinicData.phoneNumber}`}
                                   className="hover:text-primary-color transition-colors">
                                    {clinicData.phoneNumber || "Chưa cập nhật"}
                                </a>
                            </InfoRow>
                            <InfoRow label="Trang web" icon={<LanguageOutlinedIcon sx={{ fontSize: 16 }} />}>
                                <span className="text-gray-400">medicare.vn</span>
                            </InfoRow>
                        </div>
                    </div>

                    {/* About */}
                    {clinicData.description && (
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <SectionLabel text="Về phòng khám" />
                            <p className="text-sm text-gray-500 leading-relaxed">{clinicData.description}</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: Sidebar (1/3) */}
                <div className="space-y-4">

                    {/* Specialties */}
                    <div className="bg-primary-color rounded-2xl p-5 text-white">
                        <SectionLabel text="Chuyên khoa" />
                        <div className="flex flex-wrap gap-2 mb-5">
                            {["Nội khoa", "Nhi khoa", "Da liễu", "Sản phụ khoa", "Xét nghiệm"].map((spec) => (
                                <span key={spec}
                                      className="bg-white/15 border border-white/20 px-3 py-1
                                                 rounded-full text-[11px] font-semibold">
                                    {spec}
                                </span>
                            ))}
                        </div>
                        <div className="border-t border-white/20 pt-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60 mb-1">
                                Hỗ trợ đặt lịch
                            </p>
                            <p className="text-lg font-bold">1900 1234</p>
                        </div>
                    </div>

                    {/* CTA card */}
                    <div className="bg-gray-900 rounded-2xl p-5 text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-2">
                            <h3 className="text-base font-bold">Sẵn sàng đặt lịch?</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Chọn dịch vụ bên dưới để bắt đầu quy trình đặt lịch hẹn.
                            </p>
                            <div className="w-8 h-1 bg-primary-color rounded-full mt-3" />
                        </div>
                        <div className="absolute -bottom-3 -right-3 text-white/5">
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 80 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicDetail;