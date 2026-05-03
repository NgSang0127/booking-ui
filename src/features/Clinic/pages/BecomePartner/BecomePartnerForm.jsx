import React from "react";
import ClinicForm from "./ClinicForm.jsx";
import { useNavigate } from "react-router-dom";

const BecomePartner = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <section className="w-full lg:w-1/2 flex flex-col items-center justify-start pt-6 pb-12 px-4 md:px-8 shadow-2xl bg-white z-10 overflow-y-auto">
                <div
                    onClick={() => navigate("/")}
                    className="w-full flex justify-start items-center cursor-pointer mb-6"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="50 30 300 300"
                        className="w-10 h-10 mr-2"
                    >
                        <path d="M 120 230 L 70 230 L 70 130 L 150 130 L 150 50 L 250 50 L 250 130 L 330 130 L 330 230 L 250 230 L 250 310 L 150 310 L 150 260" fill="none" stroke="#0088ce" strokeWidth="16" strokeLinejoin="miter" strokeLinecap="butt" />
                        <path d="M 115 238 C 130 140, 190 125, 260 100 C 245 170, 200 215, 150 235 C 185 215, 230 170, 240 125 C 180 140, 130 170, 125 238 Z" fill="#00a68c" />
                        <path d="M 142 265 C 145 185, 175 160, 230 155 C 190 170, 158 205, 158 265 Z" fill="#0088ce" />
                    </svg>
                    <span className="font-extrabold text-2xl bg-gradient-to-r from-[#0088ce] to-[#00a68c] bg-clip-text text-transparent">
                        ClinicBook
                    </span>
                </div>

                {/* Main Form */}
                <div className="w-full">
                    <ClinicForm />
                </div>
            </section>

            {/* Right Section: Banner & Information (Hidden on mobile) */}
            <section className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gray-900 relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
                />

                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10 w-[80%] max-w-lg px-6 text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                            Phát triển phòng khám cùng <span className="text-[#00a68c]">ClinicBook</span>
                        </h2>
                        <p className="text-lg text-gray-300">
                            Tiếp cận hàng ngàn bệnh nhân mới, quản lý lịch hẹn thông minh và tối ưu hóa doanh thu ngay hôm nay.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-1 gap-4 text-left bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#00a68c]/20 flex items-center justify-center text-[#00a68c] font-bold">✓</div>
                            <p className="text-white text-sm">Quản lý lịch khám trực tuyến 24/7</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#00a68c]/20 flex items-center justify-center text-[#00a68c] font-bold">✓</div>
                            <p className="text-white text-sm">Hồ sơ điện tử chuyên nghiệp, bảo mật</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#00a68c]/20 flex items-center justify-center text-[#00a68c] font-bold">✓</div>
                            <p className="text-white text-sm">Nhận thanh toán dễ dàng, minh bạch</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default BecomePartner;