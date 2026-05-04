import React from "react";
import {
    Area, Line, ComposedChart,
    CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { CircularProgress } from "@mui/material";
import { useGetEarningChartQuery } from "../../../../../redux/Dashboard/dashboardApi";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-lg text-xs min-w-[140px]">
            <p className="text-gray-400 font-medium mb-2">Ngày {label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <span className="text-gray-500">{p.name}:</span>
                    <span className="font-bold text-gray-800 ml-auto">
                        ₫{Number(p.value).toLocaleString("vi-VN")}
                    </span>
                </div>
            ))}
        </div>
    );
};

const fmtY = (v) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M`
        : v >= 1_000   ? `${(v / 1_000).toFixed(0)}K`
            : v;

const EarningChart = () => {
    const { data: chartResponse, isLoading, isError } = useGetEarningChartQuery();
    const rawData = Array.isArray(chartResponse) ? chartResponse : (chartResponse?.data || []);

    const avg = rawData.length
        ? rawData.reduce((s, d) => s + (d.earnings || 0), 0) / rawData.length : 0;
    const chartData = rawData.map((d) => ({ ...d, target: Math.round(avg * 1.1) }));
    const totalEarning = rawData.reduce((s, d) => s + (d.earnings || 0), 0);

    if (isLoading) return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center min-h-[280px]">
            <CircularProgress size={28} thickness={4} />
        </div>
    );
    if (isError) return (
        <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-center justify-center min-h-[280px]">
            <p className="text-sm text-red-500 font-medium">Không thể tải dữ liệu doanh thu</p>
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 h-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1">
                        Doanh thu theo ngày
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        ₫{totalEarning.toLocaleString("vi-VN")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Tổng trong kỳ</p>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-0.5 bg-[#0088CE] rounded-full" />
                        <span className="text-[10px] text-gray-400">Doanh thu</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 border-t border-dashed border-[#97C459]" />
                        <span className="text-[10px] text-gray-400">Mục tiêu</span>
                    </div>
                </div>
            </div>

            <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
                        <defs>
                            <linearGradient id="earningGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#0088CE" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#0088CE" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="daily" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={8} />
                        <YAxis domain={[0, "auto"]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtY} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F3F4F6", strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="earnings" name="Doanh thu" stroke="#0088CE" strokeWidth={2.5} fill="url(#earningGrad)" dot={{ r: 0 }} activeDot={{ r: 5, fill: "#0088CE", stroke: "#fff", strokeWidth: 2 }} animationDuration={1200} />
                        <Line type="monotone" dataKey="target" name="Mục tiêu" stroke="#97C459" strokeWidth={1.5} strokeDasharray="5 4" dot={false} activeDot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EarningChart;