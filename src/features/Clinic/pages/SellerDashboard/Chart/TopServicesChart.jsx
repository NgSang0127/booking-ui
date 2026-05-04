import React from "react";
import { useFetchClinicBookingsQuery } from "../../../../../redux/Booking/bookingApi";
import { CircularProgress } from "@mui/material";

const BAR_COLORS = ["#0088CE", "#185FA5", "#3B6D11", "#854F0B", "#993556", "#378ADD"];

const TopServicesChart = () => {
    const { data: bookings = [], isLoading, isError } = useFetchClinicBookingsQuery();

    if (isLoading) return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
            <CircularProgress size={26} thickness={4} />
        </div>
    );
    if (isError) return (
        <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-sm text-red-500 font-medium">Không thể tải dữ liệu dịch vụ</p>
        </div>
    );

    /* Đếm số lần xuất hiện từng dịch vụ */
    const svcMap = {};
    bookings.forEach((b) => {
        (b.services || []).forEach((s) => {
            svcMap[s.name] = (svcMap[s.name] || 0) + 1;
        });
    });

    const sorted = Object.entries(svcMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    const max = sorted[0]?.count || 1;

    if (sorted.length === 0) return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
            <p className="text-sm text-gray-400">Chưa có dữ liệu dịch vụ</p>
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 h-full">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                    Top dịch vụ được đặt nhiều nhất
                </p>
                <p className="text-xs text-gray-400">Tổng hợp từ lịch hẹn hiện có</p>
            </div>

            <div className="space-y-3">
                {sorted.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                        {/* Rank */}
                        <div
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: BAR_COLORS[i] + "20", color: BAR_COLORS[i] }}
                        >
                            {i + 1}
                        </div>
                        {/* Label */}
                        <div className="w-32 flex-shrink-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                        </div>
                        {/* Bar */}
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${(item.count / max) * 100}%`,
                                    background: BAR_COLORS[i],
                                }}
                            />
                        </div>
                        {/* Count */}
                        <span className="text-xs font-semibold text-gray-700 w-8 text-right flex-shrink-0">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopServicesChart;