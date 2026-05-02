import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BookingCard from "./BookingCard.jsx";
import { useFetchCustomerBookingsQuery } from "../../../../redux/Booking/bookingApi";

const STATUS_TABS = [
    { id: "ALL",       label: "Tất cả"     },
    { id: "PENDING",   label: "Đang chờ"   },
    { id: "CONFIRMED", label: "Đã xác nhận"},
    { id: "COMPLETED", label: "Hoàn thành" },
    { id: "CANCELLED", label: "Đã hủy"     },
];

const STATUS_DOTS = {
    PENDING:   "#FFA726",
    CONFIRMED: "#4CAF50",
    COMPLETED: "#378ADD",
    CANCELLED: "#E57373",
};

const Bookings = () => {
    const [activeTab, setActiveTab] = useState("ALL");
    const { data: bookings = [], isLoading, isError, error } = useFetchCustomerBookingsQuery();

    const filtered = activeTab === "ALL"
        ? bookings
        : bookings.filter((b) => b.status === activeTab);

    const countFor = (id) =>
        id === "ALL" ? bookings.length : bookings.filter((b) => b.status === id).length;

    /* Loading */
    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <CircularProgress size={30} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải lịch hẹn của bạn...</p>
        </div>
    );

    /* Error */
    if (isError) return (
        <div className="max-w-2xl mx-auto px-5 py-12">
            <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-sm font-medium text-red-500">
                    {error?.data?.message || "Không thể tải danh sách lịch hẹn. Vui lòng thử lại!"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F4F8] pb-16">
            <div className="max-w-4xl mx-auto pt-10 space-y-6">

                {/* ── Header ── */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Theo dõi và quản lý các cuộc hẹn khám bệnh
                        </p>
                    </div>
                    {bookings.length > 0 && (
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100
                                        px-3.5 py-1.5 rounded-full">
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: "#0088CE" }} />
                            <span className="text-sm font-bold text-blue-700">
                                {bookings.length} lịch hẹn
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Status tabs ── */}
                {bookings.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                        {STATUS_TABS.map((t) => {
                            const count   = countFor(t.id);
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex items-center gap-1.5 flex-shrink-0 px-3.5 py-2 rounded-xl
                                                text-xs font-semibold transition-all duration-150
                                                ${isActive
                                        ? "bg-white text-primary-color border border-blue-200 shadow-sm"
                                        : "bg-white/60 text-gray-500 border border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {t.id !== "ALL" && (
                                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                                              style={{ background: STATUS_DOTS[t.id] }} />
                                    )}
                                    {t.label}
                                    {count > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md
                                                         ${isActive ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Content ── */}
                {bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-5
                                    bg-white border border-dashed border-gray-200 rounded-2xl text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <CalendarMonthOutlinedIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-gray-700">Bạn chưa có lịch hẹn nào</p>
                            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                                Khi bạn đặt lịch khám tại các phòng khám, thông tin sẽ được hiển thị tại đây.
                            </p>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-12 text-center bg-white border border-gray-100 rounded-2xl">
                        <p className="text-sm text-gray-400">Không có lịch hẹn nào trong trạng thái này.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((item) => (
                            <BookingCard key={item.id} booking={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;