import React, { useState } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteCategoryMutation } from "../../../../redux/Category/categoryApi";
import { showSnackbar } from "../../../../redux/uiSlice";
import UpdateCategoryForm from "./UpdateCategoryForm.jsx";

/* ── Modal style ── */
const modalStyle = {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "92%", sm: 440 },
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
    outline: "none",
    overflow: "hidden",
};

const FALLBACK = "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&w=100";

const CategoryTable = ({ categories = [], isLoading, onAddNew }) => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const [selectedId,     setSelectedId]     = useState(null);
    const [openUpdate,     setOpenUpdate]     = useState(false);
    const [deletingId,     setDeletingId]     = useState(null);

    const [deleteCategory] = useDeleteCategoryMutation();

    const handleOpenUpdate = (id) => {
        setSelectedId(id);
        setOpenUpdate(true);
        navigate(`/clinic-dashboard/category?edit=${id}`, { replace: true });
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setSelectedId(null);
        navigate(`/clinic-dashboard/category`, { replace: true });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"?\nTất cả dịch vụ thuộc danh mục này có thể bị ảnh hưởng.`)) return;
        setDeletingId(id);
        try {
            await deleteCategory(id).unwrap();
            dispatch(showSnackbar({ message: `Đã xóa danh mục "${name}" thành công!`, severity: "success" }));
        } catch (error) {
            dispatch(showSnackbar({ message: error?.data?.message || "Không thể xóa danh mục này!", severity: "error" }));
        } finally {
            setDeletingId(null);
        }
    };

    /* Loading */
    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CircularProgress size={32} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải danh mục...</p>
        </div>
    );

    /* Empty */
    if (!categories.length) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4
                        bg-white border border-gray-100 rounded-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <AddOutlinedIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">Chưa có danh mục nào</p>
                <p className="text-xs text-gray-400 mt-1">Tạo danh mục đầu tiên để phân loại dịch vụ</p>
            </div>
            {onAddNew && (
                <button
                    onClick={onAddNew}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                               text-white bg-primary-color hover:opacity-90 transition-opacity"
                >
                    <AddOutlinedIcon sx={{ fontSize: 15 }} />
                    Thêm danh mục
                </button>
            )}
        </div>
    );

    return (
        <>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

                {/* Table header */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="col-span-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">#</div>
                    <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Ảnh</div>
                    <div className="col-span-5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Tên danh mục</div>
                    <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">ID</div>
                    <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 text-right">Thao tác</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-50">
                    {categories.map((item, idx) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-12 gap-4 items-center px-5 py-3.5
                                       hover:bg-gray-50/60 transition-colors"
                        >
                            {/* Index */}
                            <div className="col-span-1 text-xs font-medium text-gray-400">{idx + 1}</div>

                            {/* Image */}
                            <div className="col-span-2">
                                <img
                                    src={item.image || FALLBACK}
                                    alt={item.name}
                                    onError={(e) => { e.target.src = FALLBACK; }}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                />
                            </div>

                            {/* Name */}
                            <div className="col-span-5">
                                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                            </div>

                            {/* ID */}
                            <div className="col-span-2">
                                <code className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                                    #{item.id}
                                </code>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end gap-1.5">
                                <button
                                    onClick={() => handleOpenUpdate(item.id)}
                                    title="Chỉnh sửa"
                                    className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100
                                               flex items-center justify-center
                                               hover:bg-blue-100 transition-colors"
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 15 }} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id, item.name)}
                                    disabled={deletingId === item.id}
                                    title="Xóa danh mục"
                                    className="w-8 h-8 rounded-xl bg-red-50 text-red-500 border border-red-100
                                               flex items-center justify-center
                                               hover:bg-red-100 transition-colors
                                               disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {deletingId === item.id
                                        ? <CircularProgress size={12} sx={{ color: "#ef4444" }} />
                                        : <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer count */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Tổng <span className="font-semibold text-gray-600">{categories.length}</span> danh mục
                    </p>
                </div>
            </div>

            {/* Update modal */}
            <Modal open={openUpdate} onClose={handleCloseUpdate}>
                <Box sx={modalStyle}>
                    <UpdateCategoryForm categoryId={selectedId} onClose={handleCloseUpdate} />
                </Box>
            </Modal>
        </>
    );
};

export default CategoryTable;