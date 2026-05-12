import React from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon         from "@mui/icons-material/AccessTimeOutlined";
import HomeOutlinedIcon               from "@mui/icons-material/HomeOutlined";
import EmailOutlinedIcon              from "@mui/icons-material/EmailOutlined";
import SupportAgentOutlinedIcon       from "@mui/icons-material/SupportAgentOutlined";

const NOTES = [
    { icon: <AccessTimeOutlinedIcon  sx={{ fontSize: 15 }} />, text: "Thời gian xét duyệt từ 1 – 3 ngày làm việc" },
    { icon: <EmailOutlinedIcon       sx={{ fontSize: 15 }} />, text: "Bạn sẽ nhận thông báo qua email khi có kết quả" },
    { icon: <SupportAgentOutlinedIcon sx={{ fontSize: 15 }} />, text: "Liên hệ support@clinicbook.com nếu cần hỗ trợ gấp" },
];

const PendingApproval = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center px-5 py-12">
            <div className="w-full max-w-md space-y-4">

                {/* ── Main card ── */}
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-4">

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100
                                    flex items-center justify-center mx-auto">
                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 32, color: "#00a68c" }} />
                    </div>

                    {/* Text */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h2>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                            Phòng khám của bạn đang chờ Admin xét duyệt.
                            Chúng tôi sẽ thông báo qua email khi có kết quả.
                        </p>
                    </div>

                    {/* Status pill */}
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100
                                    px-4 py-2 rounded-full mx-auto">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs font-bold text-amber-700">Đang chờ xét duyệt</span>
                    </div>
                </div>

                {/* ── Notes card ── */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                        Lưu ý quan trọng
                    </p>
                    <div className="space-y-3">
                        {NOTES.map((n, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100
                                                flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                                    {n.icon}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{n.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Actions ── */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center justify-center gap-2
                               text-sm font-semibold text-primary-color
                               bg-white border border-primary-color/20 hover:border-primary-color
                               hover:bg-blue-50 py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                    <HomeOutlinedIcon sx={{ fontSize: 16 }} />
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PendingApproval;