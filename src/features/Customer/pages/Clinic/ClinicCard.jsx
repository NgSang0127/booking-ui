import React from "react";
import StarIcon from "@mui/icons-material/Star";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg?auto=compress&cs=tinysrgb&w=600";

const ClinicCard = ({ clinic }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/clinic/${clinic.id}`)}
            className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden
                       hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-44">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={clinic.images?.[0] || FALLBACK_IMAGE}
                    alt={clinic.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                {/* Open badge */}
                <div className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold
                                 px-2 py-1 rounded-full
                                 ${!clinic.isOpen
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${clinic.isOpen ? "bg-green-500" : "bg-gray-400"}`} />
                    {!clinic.isOpen ? "Đang mở" : "Đã đóng"}
                </div>
                {/* Rating */}
                {clinic.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1
                                    bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <StarIcon sx={{ fontSize: 12, color: "#f59e0b" }} />
                        <span className="text-[11px] font-bold text-gray-800">{clinic.rating}</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
                <h2 className="text-sm font-semibold text-gray-900 truncate">{clinic.name}</h2>
                {clinic.description && (
                    <p className="text-[12px] text-gray-400 line-clamp-2 leading-relaxed">
                        {clinic.description}
                    </p>
                )}
                <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-0.5">
                    <LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
                    <span className="truncate">{clinic.address}{clinic.city ? `, ${clinic.city}` : ""}</span>
                </div>
            </div>
        </div>
    );
};

export default ClinicCard;