import React from "react";
import {useNavigate} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Navigation} from "swiper/modules";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import {services} from "../../../../data/services.js";
import HomeServiceCard from "./HomeServiceCard.jsx";
import ClinicCard from "../Clinic/ClinicCard.jsx";
import Banner from "./Banner.jsx";
import {useGetClinicsQuery} from "../../../../redux/Clinic/clinicApi";
import LoadingManager from "../../../Loading/LoaderManager.jsx";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

/* ─── Gallery images ─── */
const GALLERY_IMAGES = [
    { src: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&w=600", alt: "Bác sĩ tư vấn", tall: true },
    { src: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&w=400", alt: "Khám sức khỏe", tall: false },
    { src: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&w=400", alt: "Phòng khám hiện đại", tall: false },
];

const WHY_US = [
    { icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />, title: "Đặt lịch dễ dàng", desc: "Chọn dịch vụ, chọn giờ — xong trong vài bước đơn giản.", bg: "#E6F1FB", color: "#185FA5" },
    { icon: <VerifiedIcon sx={{ fontSize: 20 }} />, title: "Phòng khám uy tín", desc: "Tất cả đối tác được xác minh chất lượng trước khi lên nền tảng.", bg: "#EAF3DE", color: "#3B6D11" },
    { icon: <ShieldOutlinedIcon sx={{ fontSize: 20 }} />, title: "Thanh toán an toàn", desc: "Giao dịch được mã hóa, hoàn tiền nếu có sự cố.", bg: "#FAEEDA", color: "#854F0B" },
    { icon: <SupportAgentOutlinedIcon sx={{ fontSize: 20 }} />, title: "Hỗ trợ 24/7", desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.", bg: "#FBEAF0", color: "#993556" },
];

const SectionLabel = ({ text, colorClass = "bg-blue-50 text-blue-900" }) => (
    <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full inline-block ${colorClass}`}>
        {text}
    </span>
);

/* ─── Main component ─── */
const Home = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetClinicsQuery({ page: 0, size: 12,status: 'APPROVED' });
    const clinics = data?.content || [];

    if (isLoading && clinics.length === 0) {
        return <LoadingManager fullScreen={true} />;
    }
    return (
        <div className="bg-[#F0F4F8]">

            {/* ── 1. Hero Carousel ── */}
            <Banner />

            {/* ── 2. Chuyên khoa ── */}
            <section className="bg-white border-b border-gray-100 py-10">
                <div className="container mx-auto px-6 md:px-16 lg:px-20">
                    <div className="flex items-end justify-between mb-5 gap-4">
                        <div className="space-y-1">
                            <SectionLabel text="Chuyên khoa" />
                            <h2 className="text-2xl font-bold text-gray-900">Bạn cần dịch vụ gì?</h2>
                            <p className="text-gray-400 text-sm">Chọn chuyên khoa phù hợp để tìm phòng khám nhanh nhất.</p>
                        </div>

                        {/* Nav chỉ hiện md+ */}
                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            <div className="flex gap-1.5">
                                <button className="svc-prev w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-blue-200 hover:text-primary-color transition-all">
                                    <ArrowBackIosNewIcon sx={{ fontSize: 11 }} />
                                </button>
                                <button className="svc-next w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-blue-200 hover:text-primary-color transition-all">
                                    <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
                                </button>
                            </div>
                            <button
                                onClick={() => navigate("/search")}
                                className="flex items-center gap-1 text-sm font-medium text-primary-color border border-primary-color/20 hover:border-primary-color px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Xem tất cả <ArrowForwardIcon sx={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile: flex-wrap pills */}
                    <div className="md:hidden flex flex-wrap gap-2">
                        {services.map((item) => (
                            <HomeServiceCard key={item.id} item={item} />
                        ))}
                        <button
                            onClick={() => navigate("/search")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full
                                       bg-blue-50 border border-blue-200 text-[12px]
                                       font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                            <ArrowForwardIcon sx={{ fontSize: 14 }} />
                            Xem thêm
                        </button>
                    </div>

                    {/* Desktop: Swiper */}
                    <div className="hidden md:block overflow-hidden pb-1">
                        <Swiper
                            modules={[Navigation, FreeMode]}
                            slidesPerView="auto"
                            spaceBetween={8}
                            freeMode
                            navigation={{ prevEl: ".svc-prev", nextEl: ".svc-next" }}
                            style={{ paddingTop: "4px", paddingBottom: "4px" }}
                        >
                            {services.map((item) => (
                                <SwiperSlide key={item.id} style={{ width: "auto" }}>
                                    <HomeServiceCard item={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* ── 3. Why Us ── */}
            <section className="py-12">
                <div className="container mx-auto px-6 md:px-16 lg:px-20">
                    <div className="text-center mb-8 space-y-1">
                        <SectionLabel text="Tại sao chọn chúng tôi" />
                        <h2 className="text-2xl font-bold text-gray-900">Trải nghiệm khác biệt</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {WHY_US.map((w) => (
                            <div key={w.title} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: w.bg, color: w.color }}>
                                    {w.icon}
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">{w.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Gallery + Giới thiệu ── */}
            <section className="bg-white border-y border-gray-100 py-12">
                <div className="container mx-auto px-6 md:px-16 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[360px] rounded-3xl overflow-hidden">
                            {GALLERY_IMAGES.map((img) => (
                                <div key={img.src} className={`overflow-hidden group ${img.tall ? "row-span-2" : ""}`}>
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={img.src} alt={img.alt} loading="lazy" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <SectionLabel text="Câu chuyện của chúng tôi" />
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                                Kết nối bạn với{" "}
                                <span className="text-primary-color">phòng khám tốt nhất</span>
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                ClinicBook ra đời để xóa bỏ rào cản giữa bệnh nhân và cơ sở y tế chất lượng.
                                Chúng tôi tin rằng mỗi người đều xứng đáng được chăm sóc sức khỏe tốt nhất.
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {[{ val: "500+", lbl: "Phòng khám" }, { val: "10K+", lbl: "Bệnh nhân" }, { val: "99%", lbl: "Hài lòng" }].map((s) => (
                                    <div key={s.lbl} className="text-center bg-gray-50 rounded-xl py-3">
                                        <p className="text-xl font-bold text-primary-color">{s.val}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{s.lbl}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate("/about")} className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary-color px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                                Tìm hiểu thêm <ArrowForwardIcon sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. Phòng khám nổi bật ── */}
            <section className="py-12">
                <div className="container mx-auto px-6 md:px-16 lg:px-20">
                    <div className="flex items-end justify-between mb-6 gap-4">
                        <div className="space-y-1">
                            <SectionLabel text="Phòng khám nổi bật" colorClass="bg-green-50 text-green-900" />
                            <h2 className="text-2xl font-bold text-gray-900">Lựa chọn tốt nhất cho bạn</h2>
                            <p className="text-gray-400 text-sm">Được đánh giá cao bởi hàng nghìn bệnh nhân.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex gap-1.5">
                                <button className="clinic-prev w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-blue-200 hover:text-primary-color transition-all">
                                    <ArrowBackIosNewIcon sx={{ fontSize: 11 }} />
                                </button>
                                <button className="clinic-next w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-blue-200 hover:text-primary-color transition-all">
                                    <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
                                </button>
                            </div>
                            <button
                                onClick={() => navigate("/search")}
                                className="flex items-center gap-1 text-sm font-medium text-primary-color border border-primary-color/20 hover:border-primary-color px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Xem tất cả <ArrowForwardIcon sx={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <LoaderManager fullScreen={false}/>
                        </div>
                    ) : isError ? (
                        <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
                            <p className="text-sm text-red-500 font-medium">Không thể tải danh sách phòng khám.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden pb-2">
                            <Swiper
                                modules={[Navigation]}
                                slidesPerView={1.2}
                                spaceBetween={14}
                                navigation={{ prevEl: ".clinic-prev", nextEl: ".clinic-next" }}
                                breakpoints={{
                                    640:  { slidesPerView: 2.2 },
                                    1024: { slidesPerView: 3.2 },
                                    1280: { slidesPerView: 4 },
                                }}
                                style={{ paddingBottom: "4px" }}
                            >
                                {clinics.map((clinic) => (
                                    <SwiperSlide key={clinic.id}>
                                        <ClinicCard clinic={clinic} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            </section>

            {/* ── 6. CTA ── */}
            <section className="container mx-auto px-6 md:px-16 lg:px-20 pb-14">
                <div className="bg-primary-color rounded-3xl px-8 py-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 pointer-events-none" />
                    <div className="relative z-10 max-w-lg mx-auto space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold">Sẵn sàng đặt lịch hẹn đầu tiên?</h2>
                        <p className="text-white/65 text-sm">Hàng trăm phòng khám đang chờ bạn. Đặt lịch ngay hôm nay.</p>
                        <div className="flex justify-center gap-3 pt-1 flex-wrap">
                            <button onClick={() => navigate("/search")} className="px-6 py-2.5 bg-white text-primary-color text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                                Tìm phòng khám
                            </button>
                            <button onClick={() => navigate("/about")} className="px-6 py-2.5 bg-transparent border border-white/30 text-white text-sm rounded-xl hover:bg-white/10 transition-colors">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;