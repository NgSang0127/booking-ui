import React, { useMemo, useState } from "react";
import { CircularProgress } from "@mui/material";
import TransactionTable from "./TransactionTable.jsx";
import Payouts from "./PayoutsTable.jsx";
import { getPriceTotal } from "../../../../util/totalEarning.js";
import { useFetchClinicBookingsQuery } from "../../../../redux/Booking/bookingApi";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

const TABS = [
    { id: "Transaction", label: "Giao dịch",         icon: <ReceiptLongOutlinedIcon    sx={{ fontSize: 15 }} /> },
    { id: "Payouts",     label: "Yêu cầu rút tiền",  icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 15 }} /> },
];

const Payment = () => {
    const [activeTab, setActiveTab] = useState("Transaction");
    const { data: bookings = [], isLoading } = useFetchClinicBookingsQuery();

    const totalEarning = useMemo(() => getPriceTotal(bookings), [bookings]);
    const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CircularProgress size={30} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải dữ liệu tài chính...</p>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">Tài chính & Thanh toán</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    Quản lý doanh thu và theo dõi các giao dịch thanh toán của phòng khám
                </p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Total revenue */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden">
                    {/* Decorative blob */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-50 pointer-events-none" />
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100
                                            flex items-center justify-center text-blue-600">
                                <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
                            </div>
                            <div className="flex items-center gap-1 text-green-600
                                            bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                                <TrendingUpIcon sx={{ fontSize: 12 }} />
                                <span className="text-[10px] font-bold">+12%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                                Tổng doanh thu
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Intl.NumberFormat("vi-VN").format(totalEarning)}
                                <span className="text-sm font-medium text-gray-400 ml-1">₫</span>
                            </p>
                        </div>
                        <div className="border-t border-gray-50 pt-2 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400">Tháng này</span>
                            <span className="text-[11px] font-semibold text-gray-600">Tạm tính</span>
                        </div>
                    </div>
                </div>

                {/* Completed bookings */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-green-50 pointer-events-none" />
                    <div className="relative z-10 space-y-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100
                                        flex items-center justify-center text-green-600">
                            <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                                Giao dịch hoàn thành
                            </p>
                            <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                        </div>
                        <div className="border-t border-gray-50 pt-2">
                            <span className="text-[11px] text-gray-400">
                                Trên tổng <span className="font-semibold text-gray-600">{bookings.length}</span> lịch hẹn
                            </span>
                        </div>
                    </div>
                </div>

                {/* Last payout */}
                <div className="bg-primary-color rounded-2xl p-5 relative overflow-hidden text-white">
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
                    <div className="relative z-10 space-y-3">
                        <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20
                                        flex items-center justify-center">
                            <AccountBalanceOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60 mb-1">
                                Thanh toán gần nhất
                            </p>
                            <p className="text-2xl font-bold">0 ₫</p>
                        </div>
                        <div className="border-t border-white/20 pt-2">
                            <span className="text-[11px] text-white/60">Chưa có giao dịch nào</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                                    transition-all duration-150
                                    ${activeTab === t.id
                            ? "bg-white text-primary-color shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            <div className="transition-all duration-200">
                {activeTab === "Transaction" ? <TransactionTable /> : <Payouts />}
            </div>
        </div>
    );
};

export default Payment;