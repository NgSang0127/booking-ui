import React from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import TrendingUpIcon                    from "@mui/icons-material/TrendingUp";
import CalendarMonthOutlinedIcon         from "@mui/icons-material/CalendarMonthOutlined";
import CancelOutlinedIcon                from "@mui/icons-material/CancelOutlined";
import AccountBalanceWalletOutlinedIcon  from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowForwardIcon                  from "@mui/icons-material/ArrowForward";
import EarningChart       from "./Chart/EarningChart.jsx";
import BookingChart       from "./Chart/BookingChart.jsx";
import StatCard           from "./Chart/StatCard.jsx";
import QuickLinks         from "./Chart/QuickLinks.jsx";

import { useGetClinicReportQuery } from "../../../../redux/Booking/bookingApi";
import StatusChart from "./Chart/StatusChart.jsx";
import PaymentSummaryCard from "./Chart/PaymentSummaryCard.jsx";
import TopServicesChart from "./Chart/TopServicesChart.jsx";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

const HomePage = () => {
    const navigate = useNavigate();
    const { data: report = {}, isLoading, isError } = useGetClinicReportQuery();

    const STATS = [
        {
            icon:    <TrendingUpIcon                    sx={{ fontSize: 20 }} />,
            label:   "Doanh thu",
            value:   "₫" + fmt(report.totalEarnings),
            sub:     "Tổng cộng",
            color:   "#185FA5", bgColor: "#E6F1FB",
            trend:   "+12%", trendUp: true,
        },
        {
            icon:    <CalendarMonthOutlinedIcon         sx={{ fontSize: 20 }} />,
            label:   "Lịch đặt",
            value:   fmt(report.totalBookings),
            sub:     "Tổng lịch hẹn",
            color:   "#3B6D11", bgColor: "#EAF3DE",
            trend:   "+8%", trendUp: true,
        },
        {
            icon:    <AccountBalanceWalletOutlinedIcon  sx={{ fontSize: 20 }} />,
            label:   "Hoàn tiền",
            value:   "₫" + fmt(report.totalRefund),
            sub:     "Tổng hoàn tiền",
            color:   "#854F0B", bgColor: "#FAEEDA",
        },
        {
            icon:    <CancelOutlinedIcon                sx={{ fontSize: 20 }} />,
            label:   "Đã hủy",
            value:   fmt(report.cancelledBookings),
            sub:     "Lịch bị hủy",
            color:   "#993556", bgColor: "#FBEAF0",
            trend:   "-3%", trendUp: false,
        },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <LoaderManager fullScreen={true}/>
            <p className="text-sm text-gray-400">Đang tải tổng quan...</p>
        </div>
    );

    if (isError) return (
        <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm font-medium text-red-500">
                Không thể tải báo cáo. Vui lòng kiểm tra lại kết nối.
            </p>
        </div>
    );

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Tổng quan hệ thống</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString("vi-VN", {
                            weekday: "long", year: "numeric",
                            month: "long", day: "numeric",
                        })}
                    </p>
                </div>
                <button
                    onClick={() => navigate("/clinic-dashboard/bookings")}
                    className="flex items-center gap-2 text-sm font-semibold text-primary-color
                               border border-primary-color/20 bg-blue-50 hover:bg-primary-color
                               hover:text-white px-4 py-2 rounded-xl transition-all"
                >
                    Chi tiết lịch hẹn
                    <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </button>
            </div>

            {/* ── Row 1: 4 stat cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            {/* ── Row 2: Earning chart (2/3) + Status donut (1/3) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <EarningChart />
                </div>
                <div>
                    <StatusChart />
                </div>
            </div>

            {/* ── Row 3: Booking bar (2/3) + Payment summary (1/3) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <BookingChart />
                </div>
                <div>
                    <PaymentSummaryCard />
                </div>
            </div>

            {/* ── Row 4: Top services (full width) ── */}
            <TopServicesChart />

            {/* ── Row 5: Quick links ── */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-3">
                    Truy cập nhanh
                </p>
                <QuickLinks />
            </div>
        </div>
    );
};

export default HomePage;