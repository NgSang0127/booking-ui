import React from "react";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import ReviewCard from "./ReviewCard.jsx";
import RatingCard from "./RatingCard.jsx";
import { useGetClinicReviewsQuery } from "../../../../redux/Review/reviewApi";

const Review = () => {
    const { id: clinicId } = useParams();
    const { data: reviews = [], isLoading, isError } = useGetClinicReviewsQuery(clinicId, {
        skip: !clinicId,
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CircularProgress size={30} thickness={4} />
            <p className="text-sm text-gray-400">Đang tải đánh giá...</p>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Sidebar: Rating summary ── */}
            <aside className="w-full lg:w-72 flex-shrink-0">
                <div className="sticky top-28 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">Đánh giá chung</h3>
                        <p className="text-xs text-gray-400">Dựa trên trải nghiệm thực tế của khách hàng</p>
                    </div>
                    <RatingCard totalReview={reviews.length} reviews={reviews} />
                </div>
            </aside>

            {/* ── Main: Reviews list ── */}
            <section className="flex-1 min-w-0">

                {isError ? (
                    <div className="py-10 text-center bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-sm font-medium text-red-500">
                            Không thể tải danh sách đánh giá. Vui lòng thử lại!
                        </p>
                    </div>

                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4
                                    bg-white border border-dashed border-gray-200 rounded-2xl text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <StarBorderOutlinedIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Chưa có đánh giá nào</p>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                Hãy là người đầu tiên chia sẻ trải nghiệm về dịch vụ tại phòng khám này.
                            </p>
                        </div>
                    </div>

                ) : (
                    <div>
                        {/* Count header */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                Tất cả đánh giá
                                <span className="ml-2 text-gray-600">({reviews.length})</span>
                            </p>
                        </div>

                        {/* Review list */}
                        <div className="space-y-0 bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden">
                            {reviews.map((item) => (
                                <div key={item.id} className="px-5 py-5 hover:bg-gray-50/40 transition-colors">
                                    <ReviewCard item={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Review;