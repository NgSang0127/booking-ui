import React, { useState } from "react";
import { CircularProgress, Modal, Box } from "@mui/material";
import CheckOutlinedIcon    from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon    from "@mui/icons-material/CloseOutlined";
import LockOutlinedIcon     from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon    from "@mui/icons-material/EmailOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { useDispatch } from "react-redux";
import { useGetClinicsQuery, useApproveClinicMutation } from "../../../../redux/Clinic/clinicApi";
import { showSnackbar } from "../../../../redux/uiSlice";

/* ── Status config ── */
const STATUS_CONFIG = {
    PENDING:   { label: "Chờ duyệt",  bg: "#FAEEDA", color: "#854F0B", dot: "#FFA726" },
    APPROVED:  { label: "Đã duyệt",   bg: "#EAF3DE", color: "#3B6D11", dot: "#4CAF50" },
    REJECTED:  { label: "Từ chối",    bg: "#FBEAF0", color: "#993556", dot: "#E57373" },
    SUSPENDED: { label: "Tạm khóa",   bg: "#F3F4F6", color: "#6B7280", dot: "#9CA3AF" },
};

const FILTER_TABS = [
    { id: "",          label: "Tất cả"   },
    { id: "PENDING",   label: "Chờ duyệt"},
    { id: "APPROVED",  label: "Đã duyệt" },
    { id: "REJECTED",  label: "Từ chối"  },
    { id: "SUSPENDED", label: "Tạm khóa" },
];

const FALLBACK = "https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg?auto=compress&w=80";

/* ── Modal style ── */
const modalStyle = {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "92%", sm: 420 },
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
    outline: "none",
    overflow: "hidden",
};

/* ── Action buttons per status ── */
const ActionButtons = ({ clinic, onAction }) => {
    if (clinic.status === "PENDING") return (
        <div className="flex gap-1.5">
            <button
                onClick={() => onAction(clinic.id, "APPROVED")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold
                           bg-green-50 text-green-700 border border-green-200
                           hover:bg-green-100 transition-colors"
            >
                <CheckOutlinedIcon sx={{ fontSize: 13 }} /> Duyệt
            </button>
            <button
                onClick={() => onAction(clinic.id, "REJECTED")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold
                           bg-red-50 text-red-600 border border-red-200
                           hover:bg-red-100 transition-colors"
            >
                <CloseOutlinedIcon sx={{ fontSize: 13 }} /> Từ chối
            </button>
        </div>
    );
    if (clinic.status === "APPROVED") return (
        <button
            onClick={() => onAction(clinic.id, "SUSPENDED")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold
                       bg-gray-100 text-gray-600 border border-gray-200
                       hover:bg-gray-200 transition-colors"
        >
            <LockOutlinedIcon sx={{ fontSize: 13 }} /> Tạm khóa
        </button>
    );
    if (clinic.status === "SUSPENDED") return (
        <button
            onClick={() => onAction(clinic.id, "APPROVED")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold
                       bg-green-50 text-green-700 border border-green-200
                       hover:bg-green-100 transition-colors"
        >
            <LockOpenOutlinedIcon sx={{ fontSize: 13 }} /> Mở lại
        </button>
    );
    return null;
};

/* ════════════════════════════════════════
   Main Component
════════════════════════════════════════ */
const AdminClinicList = () => {
    const dispatch = useDispatch();
    const [page,         setPage]         = useState(0);
    const [filterStatus, setFilterStatus] = useState("PENDING");
    const [dialog,       setDialog]       = useState({
        open: false, clinicId: null, action: null, reason: "",
    });

    const { data, isLoading } = useGetClinicsQuery({ page, size: 10, status: filterStatus });
    const [approveClinic, { isLoading: isApproving }] = useApproveClinicMutation();

    const clinics = data?.content || [];

    const openDialog  = (clinicId, action) => setDialog({ open: true, clinicId, action, reason: "" });
    const closeDialog = () => setDialog({ open: false, clinicId: null, action: null, reason: "" });

    const handleConfirm = async () => {
        try {
            await approveClinic({
                clinicId: dialog.clinicId,
                status:   dialog.action,
                reason:   dialog.reason,
            }).unwrap();
            dispatch(showSnackbar({
                message: dialog.action === "APPROVED"
                    ? "Đã duyệt phòng khám thành công!"
                    : "Đã cập nhật trạng thái phòng khám.",
                severity: "success",
            }));
            closeDialog();
        } catch {
            dispatch(showSnackbar({ message: "Có lỗi xảy ra. Vui lòng thử lại!", severity: "error" }));
        }
    };

    const DIALOG_META = {
        APPROVED:  { title: "Xác nhận duyệt",    color: "text-green-700", btnCls: "bg-green-600 hover:bg-green-700" },
        REJECTED:  { title: "Xác nhận từ chối",   color: "text-red-700",   btnCls: "bg-red-600 hover:bg-red-700"    },
        SUSPENDED: { title: "Xác nhận tạm khóa",  color: "text-gray-700",  btnCls: "bg-gray-700 hover:bg-gray-800"  },
    };
    const meta = DIALOG_META[dialog.action] || {};

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Quản lý phòng khám</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Duyệt và quản lý trạng thái các phòng khám</p>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <FilterListOutlinedIcon sx={{ fontSize: 15, color: "#9ca3af", ml: 0.5, mr: 0.5 }} />
                    {FILTER_TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { setFilterStatus(t.id); setPage(0); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                        ${filterStatus === t.id
                                ? "bg-white text-primary-color shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
                    {[
                        { label: "Phòng khám",  span: "col-span-4" },
                        { label: "Địa chỉ",     span: "col-span-3" },
                        { label: "Email",        span: "col-span-2" },
                        { label: "Trạng thái",  span: "col-span-1" },
                        { label: "Hành động",   span: "col-span-2 text-right" },
                    ].map((h) => (
                        <div key={h.label}
                             className={`${h.span} text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400`}>
                            {h.label}
                        </div>
                    ))}
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <CircularProgress size={28} thickness={4} />
                        <p className="text-sm text-gray-400">Đang tải danh sách...</p>
                    </div>

                ) : clinics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <p className="text-sm font-semibold text-gray-600">Không có phòng khám nào</p>
                        <p className="text-xs text-gray-400">trong bộ lọc này</p>
                    </div>

                ) : (
                    <div className="divide-y divide-gray-50">
                        {clinics.map((clinic) => {
                            const st = STATUS_CONFIG[clinic.status] || STATUS_CONFIG.PENDING;
                            return (
                                <div
                                    key={clinic.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center
                                               px-5 py-4 hover:bg-gray-50/60 transition-colors"
                                >
                                    {/* Name + avatar */}
                                    <div className="md:col-span-4 flex items-center gap-3">
                                        <img
                                            src={clinic.images?.[0] || FALLBACK}
                                            alt={clinic.name}
                                            onError={(e) => { e.target.src = FALLBACK; }}
                                            className="w-11 h-11 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{clinic.name}</p>
                                            <code className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">
                                                #{clinic.id}
                                            </code>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-3 flex items-start gap-1.5">
                                        <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0, mt: 0.3 }} />
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {[clinic.address, clinic.city].filter(Boolean).join(", ")}
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div className="md:col-span-2 flex items-center gap-1.5">
                                        <EmailOutlinedIcon sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }} />
                                        <p className="text-xs text-gray-500 truncate">{clinic.email || "—"}</p>
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-1">
                                        <span
                                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                                            style={{ background: st.bg, color: st.color }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                                            {st.label}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-2 flex md:justify-end">
                                        <ActionButtons clinic={clinic} onAction={openDialog} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination footer */}
                {data?.totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Trang <span className="font-semibold text-gray-600">{page + 1}</span> / {data.totalPages}
                        </p>
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200
                                           text-gray-500 hover:bg-gray-100 disabled:opacity-40
                                           disabled:pointer-events-none transition-colors"
                            >
                                ← Trước
                            </button>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page + 1 >= data.totalPages}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200
                                           text-gray-500 hover:bg-gray-100 disabled:opacity-40
                                           disabled:pointer-events-none transition-colors"
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Confirm Modal ── */}
            <Modal open={dialog.open} onClose={closeDialog}>
                <Box sx={modalStyle}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className={`text-base font-bold ${meta.color}`}>{meta.title}</h3>
                        <button
                            onClick={closeDialog}
                            className="w-8 h-8 rounded-lg flex items-center justify-center
                                       text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <CloseOutlinedIcon sx={{ fontSize: 17 }} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5 space-y-4">
                        {dialog.action === "APPROVED" ? (
                            <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
                                <CheckOutlinedIcon sx={{ fontSize: 18, color: "#3B6D11", flexShrink: 0, mt: 0.2 }} />
                                <p className="text-sm text-green-800 leading-relaxed">
                                    Phòng khám sẽ được kích hoạt và chủ sở hữu có thể đăng nhập Dashboard ngay sau khi duyệt.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                    Lý do <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={dialog.reason}
                                    onChange={(e) => setDialog((d) => ({ ...d, reason: e.target.value }))}
                                    placeholder="Nhập lý do..."
                                    autoFocus
                                    className="w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl
                                               py-2.5 px-4 placeholder:text-gray-300 resize-none
                                               focus:outline-none focus:border-blue-400 focus:bg-white
                                               hover:border-gray-300 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <button
                            onClick={closeDialog}
                            disabled={isApproving}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700
                                       px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors
                                       disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isApproving || (dialog.action !== "APPROVED" && !dialog.reason.trim())}
                            className={`flex items-center gap-2 text-sm font-semibold text-white
                                        px-5 py-2 rounded-xl transition-all active:scale-[0.98]
                                        disabled:opacity-50 disabled:pointer-events-none
                                        ${meta.btnCls}`}
                        >
                            {isApproving
                                ? <><CircularProgress size={13} sx={{ color: "white" }} /> Đang xử lý...</>
                                : <><CheckOutlinedIcon sx={{ fontSize: 15 }} /> Xác nhận</>
                            }
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default AdminClinicList;