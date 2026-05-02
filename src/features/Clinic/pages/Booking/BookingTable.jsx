import React, {useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useFetchClinicBookingsQuery, useUpdateBookingStatusMutation} from "../../../../redux/Booking/bookingApi";
import {showSnackbar} from "../../../../redux/uiSlice";
import {Box, IconButton, InputAdornment, MenuItem, OutlinedInput, Select, Tooltip} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LoaderManager from "../../../Loading/LoaderManager.jsx";


const STATUS_CONFIG = {
    CONFIRMED: { label: "Xác nhận",  bg: "#EAF3DE", color: "#27500A" },
    PENDING:   { label: "Chờ xử lý", bg: "#FAEEDA", color: "#d2ca0a" },
    CANCELLED: { label: "Đã hủy",    bg: "#FCEBEB", color: "#7a1d1d" },
};

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || { label: status, bg: "#F1EFE8", color: "#444441" };
    return (
        <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
            {cfg.label}
        </span>
    );
};

export default function BookingTable() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("ALL");

    // 2. Sử dụng Query Hook (Tự động fetch và cache)
    const { data: bookings = [], isLoading, isError, error } = useFetchClinicBookingsQuery();

    // 3. Sử dụng Mutation Hook
    const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

    // 4. Xử lý Hủy lịch
    const handleCancel = (id) => async () => {
        try {
            await updateStatus({ bookingId: id, status: "CANCELLED" }).unwrap();
            dispatch(showSnackbar({ message: "Đã hủy lịch hẹn thành công!", severity: "success" }));
        } catch (err) {
            dispatch(showSnackbar({ message: err?.data?.message || "Không thể hủy lịch!", severity: "error" }));
        }
    };

    // 5. Logic Filter (Sử dụng useMemo để tối ưu hiệu suất)
    const filtered = useMemo(() => {
        return bookings.filter((item) => {
            const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                item.customer?.fullName?.toLowerCase().includes(q) ||
                item.customer?.email?.toLowerCase().includes(q) ||
                item.services?.some((s) => s.name?.toLowerCase().includes(q));
            return matchStatus && matchSearch;
        });
    }, [bookings, search, statusFilter]);

    if (isLoading) return (
        <LoaderManager fullScreen={true}/>
    );

    return (
        <div className="">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">
                        Hiển thị {filtered.length} trên tổng số {bookings.length} lịch hẹn
                    </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <OutlinedInput
                        size="small"
                        placeholder="Tìm khách hàng, dịch vụ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                            </InputAdornment>
                        }
                        sx={{ fontSize: 13, height: 38, borderRadius: "10px", width: 240, bgcolor: 'white' }}
                    />
                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ fontSize: 13, height: 38, borderRadius: "10px", minWidth: 140, bgcolor: 'white' }}
                     variant="outlined">
                        <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
                        <MenuItem value="CONFIRMED">Xác nhận</MenuItem>
                        <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                        <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                    </Select>
                </div>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                {[
                    { label: "Xác nhận",  key: "CONFIRMED", bg: "#EAF3DE", color: "#27500A" },
                    { label: "Chờ xử lý", key: "PENDING",   bg: "#FAEEDA", color: "#633806" },
                    { label: "Đã hủy",    key: "CANCELLED", bg: "#FCEBEB", color: "#791F1F" },
                ].map((s) => {
                    const count = bookings.filter((b) => b.status === s.key).length;
                    const isActive = statusFilter === s.key;
                    return (
                        <button
                            key={s.key}
                            onClick={() => setStatus(isActive ? "ALL" : s.key)}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                                isActive ? 'bg-white border-blue-200 shadow-md ring-2 ring-blue-50' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: s.color + '10', color: s.color }}>
                                    <i className={`${s.icon} text-xl`}></i>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{s.label}</span>
                            </div>
                            <span className="text-2xl font-bold" style={{ color: s.color }}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-5">
                <div className="grid grid-cols-[2fr_1.4fr_1fr_1.6fr_1fr_80px] gap-0 border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                    {["Dịch vụ", "Thời gian", "Giá tiền", "Khách hàng", "Trạng thái", "Thao tác"].map((h) => (
                        <span key={h} className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            {h}
                        </span>
                    ))}
                </div>

                <div className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <i className="ri-calendar-event-line text-4xl text-gray-200 mb-2 block"></i>
                            <p className="text-gray-400 font-medium">Không tìm thấy lịch hẹn nào phù hợp</p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div key={item.id} className="grid grid-cols-[2fr_1.4fr_1fr_1.6fr_1fr_80px] gap-0 px-6 py-5 items-center hover:bg-gray-50/80 transition-colors">
                                <div className="flex flex-wrap gap-1.5 pr-4">
                                    {item.services?.map((svc, i) => (
                                        <span key={i} className="text-[10px] font-bold text-primary-color bg-primary-color/5 border border-primary-color/10 px-2 py-0.5 rounded-md">
                                            {svc.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-1 pr-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                        <i className="ri-calendar-line text-gray-400"></i>
                                        {item.startTime?.split("T")[0]}
                                    </div>
                                    <div className="text-[11px] text-gray-400 pl-5 font-medium">
                                        {item.startTime?.split("T")[1]?.slice(0, 5)} — {item.endTime?.split("T")[1]?.slice(0, 5)}
                                    </div>
                                </div>

                                <div className="pr-4">
                                    <span className="text-sm font-bold text-gray-900">{fmt(item.totalPrice)}</span>
                                    <span className="text-[10px] text-gray-400 ml-1 font-bold">VND</span>
                                </div>

                                <div className="flex items-center gap-3 pr-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-blue-600">
                                            {item.customer?.fullName?.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-800 truncate">{item.customer?.fullName}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{item.customer?.email}</p>
                                    </div>
                                </div>

                                <div><StatusBadge status={item.status} /></div>

                                <div className="flex justify-end">
                                    <Tooltip title={item.status === "CANCELLED" ? "Đã hủy" : "Hủy lịch hẹn"}>
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={handleCancel(item.id)}
                                                disabled={item.status === "CANCELLED" || isUpdating}
                                                sx={{
                                                    borderRadius: "10px",
                                                    color: item.status === "CANCELLED" ? "#d1d5db" : "#ef4444",
                                                    "&:hover": { bgcolor: "#fee2e2" },
                                                }}
                                            >
                                                <CancelOutlinedIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}