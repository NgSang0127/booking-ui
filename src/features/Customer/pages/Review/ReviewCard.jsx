import React from "react";
import { CircularProgress } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteReviewMutation } from "../../../../redux/Review/reviewApi";
import { showSnackbar } from "../../../../redux/uiSlice";

/* ── Avatar colour cycling ── */
const AVATAR_COLORS = [
    { bg: "#E6F1FB", text: "#185FA5" },
    { bg: "#EAF3DE", text: "#3B6D11" },
    { bg: "#FAEEDA", text: "#854F0B" },
    { bg: "#FBEAF0", text: "#993556" },
];
const avatarColor = (id = 0) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ── Readonly stars ── */
const ReadonlyStars = ({ value = 0 }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            s <= Math.round(value)
                ? <StarIcon     key={s} sx={{ fontSize: 14, color: "#f59e0b" }} />
                : <StarBorderIcon key={s} sx={{ fontSize: 14, color: "#D1D5DB" }} />
        ))}
    </div>
);

const ReviewCard = ({ item }) => {
    const dispatch     = useDispatch();
    const currentUser  = useSelector((s) => s.auth.user);
    const isOwner      = currentUser?.id === item.user?.id;
    const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;
        try {
            await deleteReview(item.id).unwrap();
            dispatch(showSnackbar({ message: "Đã xóa đánh giá thành công!", severity: "success" }));
        } catch (error) {
            dispatch(showSnackbar({ message: error?.data?.message || "Không thể xóa đánh giá lúc này.", severity: "error" }));
        }
    };

    const initials = item.user?.fullName?.[0]?.toUpperCase() || "?";
    const av       = avatarColor(item.user?.id || 0);

    const formattedDate = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
        })
        : "Vừa xong";

    const rating = item.reviewRating || item.rating || 0;

    return (
        <div className="flex items-start gap-3.5 w-full">

            {/* Avatar */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center
                           text-sm font-bold flex-shrink-0"
                style={{ background: av.bg, color: av.text }}
            >
                {initials}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {item.user?.fullName || "Ẩn danh"}
                        </p>
                        <p className="text-[11px] text-gray-400">{formattedDate}</p>
                    </div>

                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-7 h-7 rounded-lg flex items-center justify-center
                                       text-gray-300 hover:text-red-500 hover:bg-red-50
                                       transition-all flex-shrink-0 disabled:opacity-50"
                        >
                            {isDeleting
                                ? <CircularProgress size={12} sx={{ color: "#ef4444" }} />
                                : <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                            }
                        </button>
                    )}
                </div>

                {/* Stars */}
                <div className="mb-2">
                    <ReadonlyStars value={rating} />
                </div>

                {/* Text */}
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {item.reviewText}
                </p>
            </div>
        </div>
    );
};

export default ReviewCard;