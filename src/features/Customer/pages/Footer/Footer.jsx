import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Facebook,
    Instagram,
    LinkedIn,
    PhoneOutlined,
    LocationOnOutlined,
    X
} from "@mui/icons-material";
import ContactMailIcon from '@mui/icons-material/ContactMail';

const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Book Appointment", path: "/search" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Become a Partner", path: "/become-partner" },
];

const SERVICES = [
    { label: "General Checkup", path: "/services/common" },
    { label: "Dental Care", path: "/services/dental" },
    { label: "Skin & Aesthetics", path: "/services/skin" },
    { label: "Wellness & Spa", path: "/services/wellness" },
];

const Footer = () => {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert("Cảm ơn bạn đã đăng ký nhận tin từ ClinicBook!");
    };

    return (
        <footer className="bg-gray-950 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 md:px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10">

                    {/* Brand & Logo */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                            {/* SVG Logo Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="50 30 300 300"
                                className="w-10 h-10"
                            >
                                {/* Cross Outline */}
                                <path
                                    d="M 120 230 L 70 230 L 70 130 L 150 130 L 150 50 L 250 50 L 250 130 L 330 130 L 330 230 L 250 230 L 250 310 L 150 310 L 150 260"
                                    fill="none"
                                    stroke="#0088ce"
                                    strokeWidth="16"
                                    strokeLinejoin="miter"
                                    strokeLinecap="butt"
                                />
                                {/* Green Leaf */}
                                <path
                                    d="M 115 238 C 130 140, 190 125, 260 100 C 245 170, 200 215, 150 235 C 185 215, 230 170, 240 125 C 180 140, 130 170, 125 238 Z"
                                    fill="#00a68c"
                                />
                                {/* Blue Leaf */}
                                <path
                                    d="M 142 265 C 145 185, 175 160, 230 155 C 190 170, 158 205, 158 265 Z"
                                    fill="#0088ce"
                                />
                            </svg>
                            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#0088ce] to-[#00a68c] bg-clip-text text-transparent">
                                ClinicBook
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed mt-2">
                            Your one-stop destination for discovering and booking premium clinic & wellness services near you.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#1877F2] transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Facebook fontSize="medium" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#E4405F] transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram fontSize="medium" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#0A66C2] transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedIn fontSize="medium" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-[#0F1419] transition-colors duration-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <X fontSize="medium" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {NAV_LINKS.map(({ label, path }) => (
                                <li key={path}>
                                    <button
                                        onClick={() => navigate(path)}
                                        className="hover:text-white transition-colors"
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                            Our Services
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {SERVICES.map(({ label, path }) => (
                                <li key={path}>
                                    <button
                                        onClick={() => navigate(path)}
                                        className="hover:text-white transition-colors"
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact + Newsletter */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                            Contact
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <ContactMailIcon fontSize="small" className="text-[#00a68c]" />
                                support@clinicbook.com
                            </li>
                            <li className="flex items-center gap-2">
                                <PhoneOutlined fontSize="small" className="text-[#00a68c]" />
                                +84 234 567 890
                            </li>
                            <li className="flex items-center gap-2">
                                <LocationOnOutlined fontSize="small" className="text-[#00a68c]" />
                                Ho Chi Minh City, Vietnam
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="pt-4">
                            <p className="text-sm text-gray-300 mb-2">Nhận tin tức & ưu đãi</p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="bg-gray-900 border border-gray-700 focus:border-[#00a68c] rounded-xl px-4 py-2.5 text-sm outline-none w-full transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#00a68c] to-[#0088ce] hover:brightness-110 text-white font-medium py-2.5 rounded-xl transition-all text-sm"
                                >
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-600">
                <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {year} ClinicBook. All Rights Reserved.</p>

                    <div className="flex gap-6 text-xs">
                        <button className="hover:text-gray-400 transition-colors">Privacy Policy</button>
                        <button className="hover:text-gray-400 transition-colors">Terms of Service</button>
                        <button className="hover:text-gray-400 transition-colors">Security</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;