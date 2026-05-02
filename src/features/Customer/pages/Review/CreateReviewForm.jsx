import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useCreateReviewMutation } from "../../../../redux/Review/reviewApi";
import { showSnackbar } from "../../../../redux/uiSlice";

const validationSchema = Yup.object({
    reviewText: Yup.string()
        .required("Vui lòng nhập nội dung đánh giá")
        .min(10, "Đánh giá phải có ít nhất 10 ký tự"),
    reviewRating: Yup.number()
        .required("Vui lòng chọn số sao")
        .min(1, "Vui lòng chọn ít nhất 1 sao")
        .max(5),
});

const RATING_LABELS = {
    1: { text: "Rất tệ",       bg: "#FBEAF0", color: "#993556" },
    2: { text: "Bình thường",  bg: "#FAEEDA", color: "#854F0B" },
    3: { text: "Tốt",          bg: "#E6F1FB", color: "#185FA5" },
    4: { text: "Rất tốt",      bg: "#EAF3DE", color: "#3B6D11" },
    5: { text: "Tuyệt vời ✨", bg: "#EAF3DE", color: "#3B6D11" },
};

/* ── Star rating component thuần (không dùng MUI Rating) ── */
const StarRating = ({ value, onChange, disabled }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                disabled={disabled}
                onClick={() => onChange(star)}
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none disabled:pointer-events-none"
            >
                {star <= value
                    ? <StarIcon     sx={{ fontSize: 32, color: "#f59e0b" }} />
                    : <StarBorderIcon sx={{ fontSize: 32, color: "#D1D5DB" }} />
                }
            </button>
        ))}
    </div>
);

const CreateReviewForm = ({ onSuccess }) => {
    const dispatch  = useDispatch();
    const { id: clinicId } = useParams();
    const [submitReview, { isLoading }] = useCreateReviewMutation();

    const formik = useFormik({
        initialValues: { reviewText: "", reviewRating: 0 },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (!clinicId) return;
            try {
                await submitReview({ clinicId, reviewData: values }).unwrap();
                dispatch(showSnackbar({ message: "Cảm ơn bạn! Đánh giá đã được ghi nhận.", severity: "success" }));
                resetForm();
                if (onSuccess) onSuccess();
            } catch (error) {
                dispatch(showSnackbar({ message: error?.data?.message || "Không thể gửi đánh giá lúc này.", severity: "error" }));
            }
        },
    });

    const ratingMeta = RATING_LABELS[Math.round(formik.values.reviewRating)];
    const charCount  = formik.values.reviewText.length;
    const isDisabled = isLoading || !formik.values.reviewRating || !formik.values.reviewText;

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">

                {/* Header */}
                <div>
                    <h2 className="text-base font-bold text-gray-900 mb-0.5">Viết đánh giá</h2>
                    <p className="text-sm text-gray-400">
                        Chia sẻ trải nghiệm để giúp đỡ cộng đồng bệnh nhân
                    </p>
                </div>

                <div className="border-t border-gray-50" />

                <form onSubmit={formik.handleSubmit} className="space-y-5">

                    {/* Star rating box */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Mức độ hài lòng
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <StarRating
                                value={formik.values.reviewRating}
                                onChange={(v) => formik.setFieldValue("reviewRating", v)}
                                disabled={isLoading}
                            />
                            {ratingMeta && (
                                <span
                                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                                    style={{ background: ratingMeta.bg, color: ratingMeta.color }}
                                >
                                    {ratingMeta.text}
                                </span>
                            )}
                        </div>
                        {formik.touched.reviewRating && formik.errors.reviewRating && (
                            <p className="text-xs font-medium text-red-500 mt-1">
                                {formik.errors.reviewRating}
                            </p>
                        )}
                    </div>

                    {/* Textarea */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Cảm nhận của bạn *
                        </label>
                        <div className="relative">
                            <textarea
                                name="reviewText"
                                rows={5}
                                disabled={isLoading}
                                value={formik.values.reviewText}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Hãy chia sẻ chi tiết về chất lượng dịch vụ, cơ sở vật chất, thái độ nhân viên..."
                                className={`w-full text-sm text-gray-800 bg-gray-50 border rounded-xl
                                           py-3 px-4 placeholder:text-gray-300 resize-none leading-relaxed
                                           focus:outline-none focus:bg-white transition-all
                                           disabled:opacity-60
                                           ${formik.touched.reviewText && formik.errors.reviewText
                                    ? "border-red-300 focus:border-red-400"
                                    : "border-gray-200 focus:border-blue-400 hover:border-gray-300"
                                }`}
                            />
                            <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-300">
                                {charCount}/500
                            </span>
                        </div>
                        {formik.touched.reviewText && formik.errors.reviewText && (
                            <p className="text-xs font-medium text-red-500">{formik.errors.reviewText}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full flex items-center justify-center gap-2
                                   text-sm font-semibold text-white
                                   bg-primary-color hover:opacity-90 active:scale-[0.98]
                                   disabled:opacity-50 disabled:pointer-events-none
                                   py-3 rounded-xl transition-all"
                    >
                        {isLoading ? (
                            <><CircularProgress size={15} sx={{ color: "white" }} /> Đang gửi...</>
                        ) : (
                            <><SendOutlinedIcon sx={{ fontSize: 16 }} /> Gửi đánh giá</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateReviewForm;