import React from "react";
import { CircularProgress } from "@mui/material";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { useFetchClinicBookingsQuery } from "../../../../redux/Booking/bookingApi.js";

/* ── Helpers ── */
const fmtDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
};

const fmtPrice = (amount) =>
    Number(amount || 0).toLocaleString("vi-VN") + " ₫";

/* ── Status config ── */
const STATUS_MAP = {
    SUCCESS: { label: "Thành công",  bg: "#EAF3DE", color: "#3B6D11", dot: "#4CAF50" },
    PENDING: { label: "Đang xử lý", bg: "#FAEEDA", color: "#854F0B", dot: "#FFA726" },
    FAILURE: { label: "Thất bại",   bg: "#FBEAF0", color: "#993556", dot: "#E57373" },
};
const getStatus = (s) => STATUS_MAP[s] || STATUS_MAP.PENDING;

/* ════════════════════════════════════════
   Component
════════════════════════════════════════ */
const PayoutsTable = () => {
    const { data: transactions = [], isLoading, isError } = useFetchClinicBookingsQuery();

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CircularProgress size={30} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải dữ liệu...</p>
        </div>
    );

    if (isError) return (
        <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm font-medium text-red-500">Không thể tải dữ liệu thanh toán.</p>
        </div>
    );

    if (transactions.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4
                        bg-white border border-gray-100 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <HistoryOutlinedIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">Chưa có yêu cầu rút tiền nào</p>
                <p className="text-xs text-gray-400 mt-1">Các yêu cầu rút tiền sẽ xuất hiện tại đây</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

            {/* ── Table header ── */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
                {[
                    { label: "Mã giao dịch",   span: "col-span-2" },
                    { label: "Ngày yêu cầu",   span: "col-span-3" },
                    { label: "Số tiền",         span: "col-span-3" },
                    { label: "Phương thức",     span: "col-span-2" },
                    { label: "Trạng thái",      span: "col-span-2 text-right" },
                ].map((h) => (
                    <div key={h.label}
                         className={`${h.span} text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400`}>
                        {h.label}
                    </div>
                ))}
            </div>

            {/* ── Rows ── */}
            <div className="divide-y divide-gray-50">
                {transactions.map((item) => {
                    const st = getStatus(item.status);
                    return (
                        <div
                            key={item.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center
                                       px-5 py-4 hover:bg-gray-50/60 transition-colors"
                        >
                            {/* ID */}
                            <div className="md:col-span-2">
                                <code className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                                    #{item.id}
                                </code>
                            </div>

                            {/* Date */}
                            <div className="md:col-span-3">
                                <p className="text-sm font-medium text-gray-800">{fmtDate(item.createdAt)}</p>
                            </div>

                            {/* Amount */}
                            <div className="md:col-span-3">
                                <p className="text-sm font-bold text-gray-900">{fmtPrice(item.amount)}</p>
                            </div>

                            {/* Method */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <AccountBalanceOutlinedIcon sx={{ fontSize: 13, color: "#6b7280" }} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">Ngân hàng</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2 flex md:justify-end">
                                <span
                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold
                                               px-2.5 py-1 rounded-full"
                                    style={{ background: st.bg, color: st.color }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                          style={{ background: st.dot }} />
                                    {st.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    Tổng <span className="font-semibold text-gray-600">{transactions.length}</span> yêu cầu
                </p>
            </div>
        </div>
    );
};

export default PayoutsTable;