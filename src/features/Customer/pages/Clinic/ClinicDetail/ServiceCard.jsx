import React from "react";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=300";

const ServiceCard = ({ service, isSelected, onSelect, onRemove }) => {
    return (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200
                         ${isSelected
            ? "bg-blue-50 border-blue-200"
            : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
        }`}
        >
            {/* Image */}
            <div className="relative flex-shrink-0">
                <img
                    className="w-20 h-20 object-cover rounded-xl"
                    src={service.image || FALLBACK_IMAGE}
                    alt={service.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full
                                    flex items-center justify-center shadow-sm">
                        <CheckOutlinedIcon sx={{ fontSize: 11, color: "#fff" }} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{service.name}</h3>
                {service.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{service.description}</p>
                )}
                <div className="flex items-center gap-3 pt-1">
                    <span className="text-sm font-bold text-gray-900">
                        ₫{service.price?.toLocaleString("vi-VN")}
                    </span>
                    {service.duration && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400
                                         bg-gray-100 px-2 py-0.5 rounded-full">
                            <AccessTimeOutlinedIcon sx={{ fontSize: 11 }} />
                            {service.duration} phút
                        </span>
                    )}
                </div>
            </div>

            {/* Action button */}
            <button
                onClick={() => isSelected ? onRemove(service.id) : onSelect(service)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                            text-xs font-semibold border transition-all duration-150 active:scale-95
                            ${isSelected
                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                }`}
            >
                {isSelected
                    ? <><RemoveOutlinedIcon sx={{ fontSize: 13 }} /> Bỏ</>
                    : <><AddOutlinedIcon    sx={{ fontSize: 13 }} /> Chọn</>
                }
            </button>
        </div>
    );
};

export default ServiceCard;