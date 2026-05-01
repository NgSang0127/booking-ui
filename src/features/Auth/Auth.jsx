import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegistrationForm from "./Register.jsx";
import LoginForm from "./Login.jsx";

const AUTH_IMAGES = [
    "https://images.pexels.com/photos/6129695/pexels-photo-6129695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isLogin = location.pathname !== "/register";

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side: Form Container */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-sm">
                    {/* Brand Logo */}
                    <div
                        className="mb-10 cursor-pointer inline-block"
                        onClick={() => navigate("/")}
                    >
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-secondary-color to-primary-color bg-clip-text text-transparent">
                            ClinicBook
                        </h1>
                    </div>

                    {isLogin ? <LoginForm /> : <RegistrationForm />}
                </div>
            </div>

            {/* Right Side: Visual Section */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img
                    src={isLogin ? AUTH_IMAGES[0] : AUTH_IMAGES[1]}
                    alt="Clinic Experience"
                    className="w-full h-full object-cover transition-all duration-700"
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-color/60 to-primary-color/40" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
                    <h2 className="text-4xl font-extrabold leading-tight drop-shadow-xl">
                        Your health, <br />our priority
                    </h2>
                    <p className="mt-4 text-white/90 text-lg max-w-xs leading-relaxed font-medium">
                        Book trusted clinic appointments in seconds with ease.
                    </p>

                    {/* Trang trí thêm (Optional) */}
                    <div className="mt-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white opacity-100" />
                        <div className="w-2 h-2 rounded-full bg-white opacity-50" />
                        <div className="w-2 h-2 rounded-full bg-white opacity-50" />
                    </div>
                </div>
            </div>

            {/* Lưu ý: AppSnackbar dùng chung đã được đặt ở App.jsx hoặc AdminDashboard.jsx
                nên chúng ta không cần khai báo Snackbar ở đây nữa. */}
        </div>
    );
};

export default Auth;