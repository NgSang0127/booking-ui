import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchClinicBookingsQuery } from "../../../../../redux/Booking/bookingApi";
import { CircularProgress } from "@mui/material";

const STATUS_CONFIG = {
    CONFIRMED: { label: "Đã xác nhận", color: "#185FA5" },
    COMPLETED: { label: "Hoàn thành",  color: "#3B6D11" },
    PENDING:   { label: "Đang chờ",    color: "#854F0B" },
    CANCELLED: { label: "Đã hủy",      color: "#993556" },
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.color }} />
                <span className="text-gray-500">{payload[0].name}:</span>
                <span className="font-bold text-gray-800">{payload[0].value}</span>
            </div>
        </div>
    );
};

const StatusChart = () => {
    const { data: bookings = [], isLoading, isError } = useFetchClinicBookingsQuery();

    if (isLoading) return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center min-h-[280px]">
            <CircularProgress size={28} thickness={4} />
        </div>
    );
    if (isError) return (
        <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-center justify-center min-h-[280px]">
            <p className="text-sm text-red-500 font-medium">Không thể tải dữ liệu</p>
        </div>
    );

    /* Tổng hợp theo status */
    const counts = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
        name:  cfg.label,
        value: counts[key] || 0,
        color: cfg.color,
    })).filter((d) => d.value > 0);

    const total = pieData.reduce((s, d) => s + d.value, 0);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 h-full">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                    Trạng thái lịch hẹn
                </p>
                <p className="text-2xl font-bold text-gray-900">{total.toLocaleString("vi-VN")}</p>
                <p className="text-xs text-gray-400 mt-0.5">Tổng lịch hẹn</p>
            </div>

            <div style={{ height: 160 }} className="relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData} cx="50%" cy="50%"
                            innerRadius={52} outerRadius={72}
                            dataKey="value" paddingAngle={3}
                            animationDuration={1200}
                        >
                            {pieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-bold text-gray-900">{total}</p>
                    <p className="text-[10px] text-gray-400">tổng</p>
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
                {pieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="text-xs text-gray-500">{d.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-800">{d.value}</span>
                            <span className="text-[10px] text-gray-400 w-10 text-right">
                                {total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusChart;