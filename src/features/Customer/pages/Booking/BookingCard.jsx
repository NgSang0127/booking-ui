import React from "react";
import { CircularProgress } from "@mui/material";
import AccessTimeOutlinedIcon    from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocationOnOutlinedIcon    from "@mui/icons-material/LocationOnOutlined";
import CloseOutlinedIcon         from "@mui/icons-material/CloseOutlined";
import { useDispatch } from "react-redux";
import { useUpdateBookingStatusMutation } from "../../../../redux/Booking/bookingApi";
import { showSnackbar } from "../../../../redux/uiSlice";

const STATUS_CONFIG = {
    PENDING:   { label: "Đang chờ",    bg: "#FAEEDA", color: "#854F0B", dot: "#FFA726" },
    CONFIRMED: { label: "Đã xác nhận", bg: "#EAF3DE", color: "#3B6D11", dot: "#4CAF50" },
    CANCELLED: { label: "Đã hủy",      bg: "#FBEAF0", color: "#993556", dot: "#E57373" },
    COMPLETED: { label: "Hoàn thành",  bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
};

const FALLBACK = "https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg?auto=compress&cs=tinysrgb&w=400";

const fmtDate = (str) =>
    str ? new Date(str.split("T")[0]).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
    }) : "—";

const fmtTime = (str) => str?.split("T")[1]?.slice(0, 5) || "—";

const BookingCard = ({ booking }) => {
    const dispatch = useDispatch();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

    const canCancel = booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
    const status    = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;

    const handleCancel = async () => {
        if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;
        try {
            await updateStatus({ bookingId: booking.id, status: "CANCELLED" }).unwrap();
            dispatch(showSnackbar({ message: "Đã hủy lịch hẹn thành công!", severity: "success" }));
        } catch (error) {
            dispatch(showSnackbar({ message: error?.data?.message || "Không thể hủy lịch hẹn.", severity: "error" }));
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden
                        hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200
                        flex flex-col sm:flex-row group">

            {/* ── Image ── */}
            <div className="sm:w-36 h-44 sm:h-auto flex-shrink-0 relative overflow-hidden bg-gray-100">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={booking.clinic?.images?.[0] || FALLBACK}
                    alt={booking.clinic?.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = FALLBACK; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* ── Content ── */}
            <div className="flex-1 min-w-0 p-5 flex flex-col gap-3">

                {/* Top row: name + status */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-gray-900 truncate">
                            {booking.clinic?.name}
                        </h2>
                        {booking.clinic?.address && (
                            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                                <LocationOnOutlinedIcon sx={{ fontSize: 12 }} />
                                <span className="truncate">{booking.clinic.address}</span>
                            </div>
                        )}
                    </div>
                    <span
                        className="flex items-center gap-1.5 flex-shrink-0 text-[10px] font-bold
                                   px-2.5 py-1 rounded-full"
                        style={{ background: status.bg, color: status.color }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: status.dot }} />
                        {status.label}
                    </span>
                </div>

                {/* Services */}
                {booking.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {booking.services.map((svc) => (
                            <span
                                key={svc.id}
                                className="text-[11px] font-semibold text-blue-700
                                           bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg"
                            >
                                {svc.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Time & date row */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 13, color: "#0088CE" }} />
                        {fmtDate(booking.startTime)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: "#0088CE" }} />
                        {fmtTime(booking.startTime)}
                        {booking.endTime && ` — ${fmtTime(booking.endTime)}`}
                    </div>
                    <code className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md ml-auto">
                        #{booking.id}
                    </code>
                </div>

                {/* Bottom row: price + cancel */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-0.5">
                            Tổng cộng
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                            ₫{booking.totalPrice?.toLocaleString("vi-VN")}
                        </p>
                    </div>

                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600
                                       border border-red-200 bg-red-50 hover:bg-red-100
                                       px-3.5 py-2 rounded-xl transition-all
                                       disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                        >
                            {isUpdating
                                ? <CircularProgress size={12} sx={{ color: "#ef4444" }} />
                                : <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                            }
                            {isUpdating ? "Đang hủy..." : "Hủy lịch hẹn"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingCard;