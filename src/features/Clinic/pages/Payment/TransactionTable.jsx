import React from "react";
import { CircularProgress } from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useFetchClinicBookingsQuery } from "../../../../redux/Booking/bookingApi.js";

/* ── Helpers ── */
const fmtDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr.split("T")[0]).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
};

const fmtTime = (dateStr) => dateStr?.split("T")[1]?.slice(0, 5) || "—";

const fmtPrice = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " ₫";

const getInitial = (name = "") => name.trim().charAt(0).toUpperCase();

/* ── Avatar colours cycling ── */
const AVATAR_COLORS = [
    { bg: "#E6F1FB", text: "#185FA5" },
    { bg: "#EAF3DE", text: "#3B6D11" },
    { bg: "#FAEEDA", text: "#854F0B" },
    { bg: "#FBEAF0", text: "#993556" },
];
const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ── Status config ── */
const statusMap = {
    CONFIRMED:  { label: "Đã xác nhận", bg: "#E6F1FB", color: "#185FA5", dot: "#378ADD" },
    COMPLETED:  { label: "Hoàn thành",  bg: "#EAF3DE", color: "#3B6D11", dot: "#4CAF50" },
    CANCELLED:  { label: "Đã huỷ",      bg: "#FBEAF0", color: "#993556", dot: "#E57373" },
    PENDING:    { label: "Chờ xử lý",   bg: "#FAEEDA", color: "#854F0B", dot: "#FFA726" },
};
const getStatus = (s) => statusMap[s] || statusMap.PENDING;

/* ══════════════════════════════════════
   Component
══════════════════════════════════════ */
const TransactionTable = () => {
    const { data: bookings = [], isLoading, isError } = useFetchClinicBookingsQuery();

    /* Loading */
    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CircularProgress size={30} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải giao dịch...</p>
        </div>
    );

    /* Error */
    if (isError) return (
        <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm font-medium text-red-500">Không thể tải dữ liệu giao dịch.</p>
        </div>
    );

    /* Empty */
    if (bookings.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4
                        bg-white border border-gray-100 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <ReceiptLongOutlinedIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">Chưa có giao dịch nào</p>
                <p className="text-xs text-gray-400 mt-1">Các lịch hẹn được đặt sẽ xuất hiện tại đây</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

            {/* ── Table header ── */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
                {[
                    { label: "Ngày & giờ",      span: "col-span-2" },
                    { label: "Khách hàng",       span: "col-span-3" },
                    { label: "Chi tiết lịch hẹn",span: "col-span-4" },
                    { label: "Trạng thái",        span: "col-span-1" },
                    { label: "Số tiền",           span: "col-span-2 text-right" },
                ].map((h) => (
                    <div key={h.label} className={`${h.span} text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400`}>
                        {h.label}
                    </div>
                ))}
            </div>

            {/* ── Rows ── */}
            <div className="divide-y divide-gray-50">
                {bookings.map((item, idx) => {
                    const av  = avatarColor(idx);
                    const st  = getStatus(item.status);

                    return (
                        <div
                            key={item.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start
                                       px-5 py-4 hover:bg-gray-50/60 transition-colors"
                        >
                            {/* Date & time */}
                            <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-2 md:gap-0">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100
                                                flex items-center justify-center text-blue-600 flex-shrink-0 md:mb-1.5">
                                    <CalendarMonthOutlinedIcon sx={{ fontSize: 15 }} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">{fmtDate(item.startTime)}</p>
                                    <p className="text-[11px] text-gray-400">{fmtTime(item.startTime)}</p>
                                </div>
                            </div>

                            {/* Customer */}
                            <div className="md:col-span-3 flex items-center gap-2.5">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center
                                               text-sm font-bold flex-shrink-0"
                                    style={{ background: av.bg, color: av.text }}
                                >
                                    {getInitial(item.customer?.fullName)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {item.customer?.fullName || "—"}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate">{item.customer?.email}</p>
                                    {item.customer?.mobile && (
                                        <p className="text-[10px] font-medium text-gray-400">{item.customer.mobile}</p>
                                    )}
                                </div>
                            </div>

                            {/* Booking detail */}
                            <div className="md:col-span-4 space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Mã:</span>
                                    <code className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">
                                        #{item.id}
                                    </code>
                                </div>
                                {item.services?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {item.services.map((svc, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] font-semibold bg-gray-100 text-gray-600
                                                           px-2 py-0.5 rounded-md"
                                            >
                                                {svc.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="md:col-span-1 flex md:justify-start">
                                <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold
                                               px-2 py-1 rounded-full whitespace-nowrap"
                                    style={{ background: st.bg, color: st.color }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                          style={{ background: st.dot }} />
                                    {st.label}
                                </span>
                            </div>

                            {/* Amount */}
                            <div className="md:col-span-2 flex md:flex-col md:items-end gap-1.5 md:gap-0">
                                <p className="text-sm font-bold text-gray-900">
                                    {fmtPrice(item.totalPrice)}
                                </p>
                                <span className={`text-[10px] font-semibold mt-0.5
                                                  ${item.status === "COMPLETED" ? "text-green-600" : "text-gray-400"}`}>
                                    {item.status === "COMPLETED" ? "✓ Đã thu" : "Dự kiến"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    Tổng <span className="font-semibold text-gray-600">{bookings.length}</span> giao dịch
                </p>
                <p className="text-xs font-semibold text-gray-700">
                    {fmtPrice(bookings.reduce((s, b) => s + (b.totalPrice || 0), 0))}
                </p>
            </div>
        </div>
    );
};

export default TransactionTable;