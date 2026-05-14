import React, {useEffect, useState} from "react";
import { InputAdornment, OutlinedInput, Tooltip} from "@mui/material";
import {useGetClinicsQuery} from "../../../../redux/Clinic/clinicApi.js";
import {showSnackbar} from "../../../../redux/uiSlice.js";
import {useDispatch} from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const ClinicTable = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [page,   setPage]   = useState(0);
    const PAGE_SIZE = 10;

    const { data, isLoading, isError, error } = useGetClinicsQuery({
        page, size: PAGE_SIZE,
    });

    useEffect(() => {
        if (isError) {
            dispatch(showSnackbar({
                message: error?.data?.message || "Không thể tải danh sách phòng khám!",
                severity: "error",
            }));
        }
    }, [isError, error, dispatch]);

    const clinics = data?.content || [];
    const totalPages = data?.totalPages || 1;

    const filtered = clinics.filter((c) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            c.name?.toLowerCase().includes(q) ||
            c.address?.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q) ||
            c.owner?.fullName?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Phòng khám</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isLoading ? "Đang tải..." : `${filtered.length} phòng khám`}
                    </p>
                </div>
                <OutlinedInput
                    size="small"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                        </InputAdornment>
                    }
                    sx={{
                        fontSize: 13, height: 34, borderRadius: "8px", width: 200,
                        "& fieldset": { borderColor: "#e5e7eb" },
                    }}
                />
            </div>

            {/* Loading */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white border border-gray-100 rounded-xl">
                    <LoaderManager fullScreen={false}/>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center bg-white border border-gray-100 rounded-xl">
                    <BusinessOutlinedIcon sx={{ fontSize: 36, color: "#e5e7eb", mb: 1 }} />
                    <p className="text-sm text-gray-400">
                        {search ? "Không tìm thấy phòng khám nào" : "Chưa có phòng khám nào"}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

                    {/* Table head */}
                    <div className="grid grid-cols-[64px_1fr_1.2fr_1fr_120px] items-center px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        {["", "Phòng khám", "Địa chỉ", "Chủ sở hữu", "Thành phố"].map((h, i) => (
                            <span key={i} className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Rows */}
                    {filtered.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`grid grid-cols-[64px_1fr_1.2fr_1fr_120px] items-center px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                                idx !== filtered.length - 1 ? "border-b border-gray-50" : ""
                            }`}
                        >
                            {/* Image */}
                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                {item.images?.[0] ? (
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageOutlinedIcon sx={{ fontSize: 18, color: "#d1d5db" }} />
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div className="min-w-0 pr-4">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                                    ID: {item.id}
                                </p>
                            </div>

                            {/* Address */}
                            <div className="min-w-0 pr-4">
                                <div className="flex items-start gap-1.5">
                                    <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af", mt: 0.3, flexShrink: 0 }} />
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                        {item.address || "—"}
                                    </p>
                                </div>
                            </div>

                            {/* Owner */}
                            <div className="min-w-0 pr-4 space-y-1">
                                {item.owner?.fullName && (
                                    <div className="flex items-center gap-1.5">
                                        <Person2OutlinedIcon sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }} />
                                        <p className="text-xs text-gray-700 truncate font-medium">
                                            {item.owner.fullName}
                                        </p>
                                    </div>
                                )}
                                {item.owner?.email && (
                                    <Tooltip title={item.owner.email} placement="top" arrow>
                                        <div className="flex items-center gap-1.5">
                                            <EmailOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }} />
                                            <p className="text-xs text-gray-400 truncate">
                                                {item.owner.email}
                                            </p>
                                        </div>
                                    </Tooltip>
                                )}
                                {!item.owner?.fullName && !item.owner?.email && (
                                    <span className="text-xs text-gray-300">—</span>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                {item.city ? (
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 truncate inline-block max-w-[110px]">
                                        {item.city}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-300">—</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-gray-400">
                        Trang {page + 1} / {totalPages}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="h-8 px-3 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                            const pageNum = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                                        pageNum === page
                                            ? "bg-primary-color text-white"
                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="h-8 px-3 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicTable;