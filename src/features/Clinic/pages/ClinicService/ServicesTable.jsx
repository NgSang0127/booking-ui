// src/features/Clinic/pages/ClinicService/ServicesTable.jsx
import React, {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Box, IconButton, InputAdornment, OutlinedInput, Tooltip, Typography} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import {useGetServicesByClinicQuery} from "../../../../redux/ClinicService/clinicServiceApi";
import {useGetCategoriesByClinicQuery} from "../../../../redux/Category/categoryApi";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const fmt = (n) => Number(n || 0).toLocaleString("vi-VN");

export default function ServicesTable() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    // 2. Lấy thông tin Clinic hiện tại từ Store
    const currentClinic = useSelector((state) => state.clinic.currentClinic);
    const clinicId = currentClinic?.id;

    // 3. Parallel Queries: Gọi cả 2 API cùng lúc, RTK Query sẽ quản lý cache và loading
    const {
        data: services = [],
        isLoading: isLoadingServices
    } = useGetServicesByClinicQuery({ clinicId }, { skip: !clinicId });

    const {
        data: categories = [],
        isLoading: isLoadingCategories
    } = useGetCategoriesByClinicQuery(clinicId, { skip: !clinicId });
    console.log("caatt",categories);

    // 4. Memoize Category Map: Tối ưu hiệu suất, chỉ tính toán lại khi danh mục thay đổi
    const categoryMap = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat.id] = cat.name;
            return acc;
        }, {});
    }, [categories]);

    // 5. Memoize Filtered List: Giúp search cực mượt, không bị lag UI
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return services.filter((s) => !q || s.name?.toLowerCase().includes(q));
    }, [services, search]);

    // Helper: Lấy tên danh mục an toàn
    const getCategoryName = (item) => {
        return item.category?.name || categoryMap[item.categoryId] || "Chưa phân loại";
    };

    if (isLoadingServices || isLoadingCategories) {
        return (
            <LoaderManager fullScreen={true}/>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Quản lý dịch vụ</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                        Bạn có <span className="text-primary-color font-bold">{services.length}</span> dịch vụ đang hoạt động
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <OutlinedInput
                        size="small"
                        placeholder="Tìm tên dịch vụ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                            </InputAdornment>
                        }
                        sx={{
                            fontSize: 13, height: 40, borderRadius: "12px", width: 220, bgcolor: 'white',
                            "& fieldset": { borderColor: "#e2e8f0" }
                        }}
                    />
                    <button
                        onClick={() => navigate("/clinic-dashboard/add-services")}
                        className="h-10 flex items-center gap-2 px-5 bg-primary-color text-white text-sm font-bold rounded-xl hover:shadow-lg hover:opacity-90 transition-all"
                    >
                        <AddIcon sx={{ fontSize: 18 }} />
                        Thêm mới
                    </button>
                </div>
            </div>

            {/* Main Content Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Table Head */}
                <div className="grid grid-cols-[64px_1fr_160px_120px_120px_60px] items-center px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                    {["", "Thông tin dịch vụ", "Danh mục", "Giá niêm yết", "Thời lượng", "Sửa"].map((h, i) => (
                        <span key={i} className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            {h}
                        </span>
                    ))}
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                <ImageOutlinedIcon sx={{ fontSize: 32, color: "#d1d5db" }} />
                            </div>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {search ? "Không tìm thấy dịch vụ phù hợp" : "Bạn chưa có dịch vụ nào"}
                            </Typography>
                        </div>
                    ) : (
                        filtered.map((item) => (
                                <div key={item.id} className="grid grid-cols-[64px_1fr_160px_120px_120px_60px] items-center px-6 py-4 hover:bg-gray-50/80 transition-colors">

                                    {/* Image Thumbnail */}
                                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageOutlinedIcon sx={{ fontSize: 20, color: "#cbd5e1" }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 pr-6">
                                        <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-[11px] text-gray-400 truncate mt-0.5 font-medium">{item.description || "Không có mô tả"}</p>
                                    </div>

                                    {/* Category Tag */}
                                    <div>
                                    <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tight">
                                        {getCategoryName(item)}
                                    </span>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <span className="text-sm font-extrabold text-gray-800">{fmt(item.price)}</span>
                                        <span className="text-[10px] text-gray-400 ml-1 font-bold">₫</span>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                        <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
                                        {item.duration || 0} phút
                                    </div>

                                    {/* Edit Button */}
                                    <div className="flex justify-end">
                                        <Tooltip title="Chỉnh sửa dịch vụ">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/clinic-dashboard/services/${item.id}`)}
                                                sx={{
                                                    width: 34, height: 34, borderRadius: "10px",
                                                    bgcolor: 'white', border: '1px solid #e2e8f0',
                                                    color: "primary.main",
                                                    "&:hover": { bgcolor: "primary.main", color: "white", borderColor: 'primary.main' },
                                                }}
                                            >
                                                <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            )
                        ))}
                </div>
            </div>
        </div>
    );
}