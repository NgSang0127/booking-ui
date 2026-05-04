import React from "react";
import { useNavigate } from "react-router-dom";
import CalendarMonthOutlinedIcon    from "@mui/icons-material/CalendarMonthOutlined";
import MedicalServicesOutlinedIcon  from "@mui/icons-material/MedicalServicesOutlined";
import CategoryOutlinedIcon         from "@mui/icons-material/CategoryOutlined";
import ReceiptLongOutlinedIcon      from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardIcon             from "@mui/icons-material/ArrowForward";

const LINKS = [
    { label: "Quản lý lịch hẹn", desc: "Xem & xử lý lịch hẹn",      path: "/clinic-dashboard/bookings",     icon: <CalendarMonthOutlinedIcon   sx={{ fontSize: 20 }} />, bg: "#E6F1FB", color: "#185FA5" },
    { label: "Dịch vụ",           desc: "Quản lý danh sách dịch vụ",  path: "/clinic-dashboard/services",    icon: <MedicalServicesOutlinedIcon  sx={{ fontSize: 20 }} />, bg: "#EAF3DE", color: "#3B6D11" },
    { label: "Danh mục",          desc: "Phân loại nhóm dịch vụ",     path: "/clinic-dashboard/category",    icon: <CategoryOutlinedIcon         sx={{ fontSize: 20 }} />, bg: "#FAEEDA", color: "#854F0B" },
    { label: "Giao dịch",         desc: "Lịch sử thanh toán",         path: "/clinic-dashboard/transaction", icon: <ReceiptLongOutlinedIcon      sx={{ fontSize: 20 }} />, bg: "#FBEAF0", color: "#993556" },
];

const QuickLinks = () => {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {LINKS.map((q) => (
                <button
                    key={q.path}
                    onClick={() => navigate(q.path)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-100
                               bg-white hover:border-gray-200 hover:shadow-sm
                               active:scale-[0.98] transition-all text-left group"
                >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                                    group-hover:scale-110 transition-transform duration-200"
                         style={{ background: q.bg, color: q.color }}>
                        {q.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{q.label}</p>
                        <p className="text-[10px] text-gray-400 truncate">{q.desc}</p>
                    </div>
                    <ArrowForwardIcon sx={{ fontSize: 14, color: "#D1D5DB" }}
                                      className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
            ))}
        </div>
    );
};

export default QuickLinks;