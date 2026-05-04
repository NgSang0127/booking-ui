import React from "react";
import {
    BarChart, Bar, CartesianGrid,
    ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { CircularProgress } from "@mui/material";
import { useGetBookingChartQuery } from "../../../../../redux/Dashboard/dashboardApi";

/* ── Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-lg text-xs">
            <p className="text-gray-400 font-medium mb-1.5">{label}</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0088CE]" />
                <span className="font-bold text-gray-800">{payload[0].value} lịch đặt</span>
            </div>
        </div>
    );
};

/* ── Custom bar shape — dùng thay Cell ── */
const CustomBar = (props) => {
    const { x, y, width, height, value, max } = props;
    if (!height || height <= 0) return null;

    const ratio = max > 0 ? value / max : 0;
    const fill =
        ratio >= 0.8 ? "#0088CE" :
            ratio >= 0.5 ? "#185FA5" :
                ratio >= 0.3 ? "#378ADD" :
                    "#85B7EB";

    const r = Math.min(4, width / 2);

    return (
        <path
            d={`
                M ${x + r},${y}
                h ${width - 2 * r}
                q ${r},0 ${r},${r}
                v ${height - r}
                h ${-(width)}
                v ${-(height - r)}
                q 0,${-r} ${r},${-r}
                z
            `}
            fill={fill}
        />
    );
};

const BookingChart = () => {
    const { data: chartResponse, isLoading, isError } = useGetBookingChartQuery();
    const chartData = Array.isArray(chartResponse) ? chartResponse : [];

    const total = chartData.reduce((s, d) => s + (d.count || 0), 0);
    const max   = Math.max(...chartData.map((d) => d.count || 0), 1);

    /* Inject max vào mỗi data point để CustomBar đọc được */
    const dataWithMax = chartData.map((d) => ({ ...d, max }));

    if (isLoading) return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center min-h-[280px]">
            <CircularProgress size={28} thickness={4} sx={{ color: "#0088CE" }} />
        </div>
    );
    if (isError) return (
        <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-center justify-center min-h-[280px]">
            <p className="text-sm text-red-500 font-medium">Không thể tải dữ liệu biểu đồ</p>
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 h-full">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                        Lịch đặt theo ngày
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{total.toLocaleString("vi-VN")}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Tổng trong kỳ</p>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                    REALTIME
                </span>
            </div>

            {/* Chart */}
            <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={dataWithMax}
                        margin={{ top: 5, right: 5, left: -28, bottom: 0 }}
                        barSize={18}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis
                            dataKey="daily"
                            tick={{ fontSize: 10, fill: "#9CA3AF" }}
                            axisLine={false} tickLine={false} dy={8}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: "#9CA3AF" }}
                            axisLine={false} tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(0,136,206,0.04)" }}
                        />
                        <Bar
                            dataKey="count"
                            shape={<CustomBar />}
                            animationDuration={1200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BookingChart;