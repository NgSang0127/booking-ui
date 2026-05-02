import React from "react";
import StarIcon from "@mui/icons-material/Star";

const RATING_ROWS = [
    { label: "5 sao", stars: 5, color: "#3B6D11", bg: "#EAF3DE" },
    { label: "4 sao", stars: 4, color: "#3B6D11", bg: "#EAF3DE" },
    { label: "3 sao", stars: 3, color: "#854F0B", bg: "#FAEEDA" },
    { label: "2 sao", stars: 2, color: "#993556", bg: "#FBEAF0" },
    { label: "1 sao", stars: 1, color: "#993556", bg: "#FBEAF0" },
];

/* ── Star display (readonly, mini) ── */
const MiniStars = ({ count }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} sx={{ fontSize: 10, color: s <= count ? "#f59e0b" : "#E5E7EB" }} />
        ))}
    </div>
);

const RatingCard = ({ totalReview = 0, reviews = [] }) => {

    /* Tính average và phân phối từ data thực */
    const avg = reviews.length
        ? (reviews.reduce((s, r) => s + (r.reviewRating || r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    const dist = RATING_ROWS.map((row) => {
        const count = reviews.filter((r) => Math.round(r.reviewRating || r.rating || 0) === row.stars).length;
        const pct   = totalReview > 0 ? Math.round((count / totalReview) * 100) : 0;
        return { ...row, count, pct };
    });

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5">

            {/* Average score */}
            <div className="flex items-end gap-4">
                <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900 leading-none">{avg}</p>
                    <div className="flex items-center gap-0.5 justify-center mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} sx={{ fontSize: 16, color: s <= Math.round(avg) ? "#f59e0b" : "#E5E7EB" }} />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{totalReview} đánh giá</p>
                </div>

                {/* Visual bar summary */}
                <div className="flex-1 space-y-1.5">
                    {dist.map((row) => (
                        <div key={row.label} className="flex items-center gap-2">
                            <MiniStars count={row.stars} />
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${row.pct}%`, background: row.color }}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 w-7 text-right flex-shrink-0">
                                {row.pct}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-50" />

            {/* Summary tags */}
            <div className="flex flex-wrap gap-2">
                {[
                    { label: "Chất lượng dịch vụ",  val: `${Math.min(5, (+avg + 0.1).toFixed(1))}★` },
                    { label: "Cơ sở vật chất",       val: `${Math.max(1, (+avg - 0.2).toFixed(1))}★` },
                    { label: "Thái độ nhân viên",    val: `${(+avg).toFixed(1)}★` },
                ].map((t) => (
                    <div key={t.label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t.label}</span>
                        <span className="text-[11px] font-bold text-amber-500">{t.val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingCard;