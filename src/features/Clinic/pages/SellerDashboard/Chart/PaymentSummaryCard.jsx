import React from "react";
import { CircularProgress } from "@mui/material";
import { useFetchClinicBookingsQuery } from "../../../../../redux/Booking/bookingApi";

const Row = ({ label, value, color }) => (
    <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-0.5">{label}</p>
        <p className="text-lg font-bold" style={{ color }}>{value}</p>
        <div className="border-t border-gray-50 mt-2.5" />
    </div>
);

const PaymentSummaryCard = () => {
    const { data: bookings = [], isLoading } = useFetchClinicBookingsQuery();

    if (isLoading) return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
            <CircularProgress size={24} thickness={4} />
        </div>
    );

    const collected = bookings
        .filter((b) => b.status === "COMPLETED")
        .reduce((s, b) => s + (b.totalPrice || 0), 0);

    const pending = bookings
        .filter((b) => b.status === "CONFIRMED" || b.status === "PENDING")
        .reduce((s, b) => s + (b.totalPrice || 0), 0);

    const refunded = bookings
        .filter((b) => b.status === "CANCELLED")
        .reduce((s, b) => s + (b.totalPrice || 0), 0);

    const fmt = (n) => "₫" + Number(n).toLocaleString("vi-VN");

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 h-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                Tổng hợp thanh toán
            </p>

            <div className="flex flex-col gap-2.5">
                <Row label="Đã thu"      value={fmt(collected)} color="#3B6D11" />
                <Row label="Chờ xử lý"  value={fmt(pending)}   color="#854F0B" />
                <Row label="Hoàn tiền"  value={fmt(refunded)}  color="#993556" />
            </div>

            {/* Progress visual */}
            <div className="mt-auto pt-1">
                <p className="text-[10px] text-gray-400 mb-1.5">Tỷ lệ thu thành công</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    {[
                        { val: collected, color: "#3B6D11" },
                        { val: pending,   color: "#FAEEDA" },
                        { val: refunded,  color: "#FBEAF0" },
                    ].map((s, i) => {
                        const total = collected + pending + refunded;
                        const pct = total > 0 ? (s.val / total) * 100 : 0;
                        return <div key={i} style={{ width: `${pct}%`, background: s.color }} />;
                    })}
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-green-700 font-semibold">
                        {collected + pending + refunded > 0
                            ? ((collected / (collected + pending + refunded)) * 100).toFixed(0)
                            : 0}% đã thu
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaymentSummaryCard;