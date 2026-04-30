import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SLIDES = [
    {
        img: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1400",
        badge: "Đặt lịch trong 60 giây",
        title: "Chăm sóc sức khỏe",
        titleAccent: "dành riêng cho bạn",
        sub: "Tìm và đặt lịch với phòng khám uy tín gần bạn — nhanh chóng, đáng tin cậy.",
        cta: "Tìm phòng khám",
        ctaPath: "/search",
    },
    {
        img: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg?auto=compress&cs=tinysrgb&w=1400",
        badge: "Hơn 500 phòng khám",
        title: "Đội ngũ bác sĩ",
        titleAccent: "chuyên môn cao",
        sub: "Được tư vấn bởi các chuyên gia hàng đầu, tận tâm và tận tình với từng bệnh nhân.",
        cta: "Khám phá ngay",
        ctaPath: "/search",
    },
    {
        img: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1400",
        badge: "Đánh giá 4.9 sao",
        title: "Trải nghiệm khám bệnh",
        titleAccent: "hoàn toàn mới",
        sub: "Đặt lịch trực tuyến, nhận nhắc nhở tự động, theo dõi lịch sử khám bệnh dễ dàng.",
        cta: "Tìm hiểu thêm",
        ctaPath: "/about",
    },
];

const STATS = [
    { value: "500+", label: "Phòng khám" },
    { value: "10K+", label: "Lượt đặt lịch" },
    { value: "4.9",  label: "Đánh giá TB", icon: <StarIcon sx={{ fontSize: 14, color: "#EF9F27" }} /> },
];

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-[88vh] min-h-[580px] overflow-hidden group">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                loop
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                speed={700}
                pagination={{ clickable: true }}
                navigation={{
                    prevEl: ".hero-prev",
                    nextEl: ".hero-next",
                }}
                className="w-full h-full"
            >
                {SLIDES.map((slide, idx) => (
                    <SwiperSlide key={idx} className="relative overflow-hidden">
                        {/* Background image */}
                        <img
                            src={slide.img}
                            alt={slide.titleAccent}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading={idx === 0 ? "eager" : "lazy"}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#042C53]/82 via-[#042C53]/55 to-[#042C53]/30" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 lg:px-32 max-w-2xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5 w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-medium text-white/85 tracking-widest uppercase">
                                    {slide.badge}
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-3">
                                {slide.title}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
                                    {slide.titleAccent}
                                </span>
                            </h1>

                            <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                                {slide.sub}
                            </p>

                            {/* CTA button */}
                            <button
                                onClick={() => navigate(slide.ctaPath)}
                                className="inline-flex items-center gap-2 bg-primary-color text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity w-fit"
                            >
                                <SearchIcon sx={{ fontSize: 16 }} />
                                {slide.cta}
                            </button>
                        </div>

                        {/* Bottom fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F0F4F8] to-transparent" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom nav arrows — visible on group hover */}
            <button className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-colors opacity-0 group-hover:opacity-100 duration-200">
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </button>
            <button className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-colors opacity-0 group-hover:opacity-100 duration-200">
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </button>

            {/* Bottom stats bar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
                {STATS.map((s, i) => (
                    <React.Fragment key={s.label}>
                        {i > 0 && <div className="w-px h-6 bg-white/20" />}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-0.5">
                                {s.icon}
                                <span className="text-lg font-bold text-white">{s.value}</span>
                            </div>
                            <span className="text-[10px] text-white/50 block mt-0.5">{s.label}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* Swiper pagination dots — custom styling via global CSS below */}
        </div>
    );
};

export default Banner;

