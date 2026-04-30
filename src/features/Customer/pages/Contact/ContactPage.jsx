import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const TOPICS = [
    { id: "support",  label: "Hỗ trợ kỹ thuật" },
    { id: "consult",  label: "Tư vấn dịch vụ"  },
    { id: "partner",  label: "Hợp tác"          },
    { id: "other",    label: "Khác"              },
];

const PRIORITIES = [
    { id: "normal",  label: "Thông thường", dot: "#9CA3AF" },
    { id: "high",    label: "Quan trọng",   dot: "#F59E0B" },
    { id: "urgent",  label: "Khẩn cấp",     dot: "#EF4444" },
];

/* ── Reusable field wrapper ── */
const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            {label}
        </label>
        {children}
    </div>
);

/* ── Input base class ── */
const inputCls = `w-full text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl
    py-2.5 px-4 placeholder:text-gray-300
    focus:outline-none focus:border-blue-400 focus:bg-white
    hover:border-gray-300 transition-all`;

/* ── Info item ── */
const InfoItem = ({ icon, label, value, sub }) => (
    <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

const ContactPage = () => {
    const [topic,    setTopic]    = useState("support");
    const [priority, setPriority] = useState("normal");
    const [sent,     setSent]     = useState(false);
    const [snack,    setSnack]    = useState(false);
    const [form,     setForm]     = useState({ name: "", phone: "", email: "", message: "" });

    const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setSnack(true);
        setForm({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSent(false), 4000);
    };

    const isDisabled = !form.name || !form.email || !form.message;

    return (
        <div className="min-h-screen bg-[#F0F4F8] pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">

                {/* ── Page header ── */}
                <div className="mb-10">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em]
                                     text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                        Luôn sẵn sàng hỗ trợ
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Liên hệ với chúng tôi</h1>
                    <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                        Bạn có câu hỏi hoặc cần hỗ trợ? Để lại lời nhắn — đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                    {/* ════ LEFT: Info panel ════ */}
                    <div className="flex flex-col gap-4">

                        {/* Contact details */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Thông tin liên hệ</p>
                            <InfoItem icon={<LocationOnOutlinedIcon sx={{ fontSize: 17 }} />} label="Địa chỉ"    value="123 Đường ABC, Quận 1" sub="TP. Hồ Chí Minh" />
                            <div className="border-t border-gray-50" />
                            <InfoItem icon={<PhoneOutlinedIcon     sx={{ fontSize: 17 }} />} label="Điện thoại" value="+84 123 456 789" />
                            <div className="border-t border-gray-50" />
                            <InfoItem icon={<EmailOutlinedIcon     sx={{ fontSize: 17 }} />} label="Email"      value="support@clinicbook.com" />
                        </div>

                        {/* Working hours */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Giờ làm việc</p>
                            {[
                                { day: "Thứ 2 – Thứ 6", time: "08:00 – 17:30" },
                                { day: "Thứ 7",          time: "08:00 – 12:00" },
                                { day: "Chủ nhật",       time: "Nghỉ"          },
                            ].map((r) => (
                                <div key={r.day} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-none">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                        {r.day}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">{r.time}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2 pt-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                                <p className="text-xs text-gray-400">Đang mở cửa hôm nay</p>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Mạng xã hội</p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    {
                                        icon: <FacebookOutlinedIcon sx={{ fontSize: 18 }} />,
                                        label: "Facebook",
                                        color: "#1877F2",
                                        href: "https://facebook.com/yourprofile"
                                    },
                                    {
                                        icon: <LinkedInIcon sx={{ fontSize: 18 }} />,
                                        label: "LinkedIn",
                                        color: "#0A66C2",
                                        href: "https://linkedin.com/in/yourprofile"
                                    },
                                    {
                                        icon: <InstagramIcon sx={{ fontSize: 18 }} />,
                                        label: "Instagram",
                                        color: "#E4405F",
                                        href: "https://instagram.com/yourprofile"
                                    },
                                    {
                                        icon: <XIcon sx={{ fontSize: 18 }} />,
                                        label: "X",
                                        color: "#000000",
                                        href: "https://x.com/yourprofile"
                                    }
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200
                           text-gray-500 text-xs font-medium
                           hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50
                           transition-all no-underline"
                                    >
                                        {React.cloneElement(s.icon, {
                                            style: { color: s.color }
                                        })}
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ════ RIGHT: Form ════ */}
                    <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 md:p-8">

                        {/* Form header */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-0.5">Gửi lời nhắn</h2>
                            <p className="text-sm text-gray-400">Chọn chủ đề và điền thông tin bên dưới</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Topic pills */}
                            <Field label="Chủ đề">
                                <div className="flex flex-wrap gap-2 pt-0.5">
                                    {TOPICS.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setTopic(t.id)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
                                                ${topic === t.id
                                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Name + Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Họ và tên *">
                                    <input
                                        value={form.name}
                                        onChange={onChange("name")}
                                        placeholder="Nguyễn Văn A"
                                        className={inputCls}
                                        required
                                    />
                                </Field>
                                <Field label="Số điện thoại">
                                    <input
                                        value={form.phone}
                                        onChange={onChange("phone")}
                                        placeholder="+84 123 456 789"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>

                            {/* Email */}
                            <Field label="Địa chỉ email *">
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={onChange("email")}
                                    placeholder="email@example.com"
                                    className={inputCls}
                                    required
                                />
                            </Field>

                            {/* Message */}
                            <Field label="Nội dung tin nhắn *">
                                <textarea
                                    rows={4}
                                    value={form.message}
                                    onChange={onChange("message")}
                                    placeholder="Mô tả vấn đề hoặc câu hỏi của bạn..."
                                    className={`${inputCls} resize-none leading-relaxed`}
                                    required
                                />
                            </Field>

                            {/* Priority */}
                            <Field label="Mức độ ưu tiên">
                                <div className="flex gap-2 flex-wrap pt-0.5">
                                    {PRIORITIES.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPriority(p.id)}
                                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
                                                ${priority === p.id
                                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.dot }} />
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* Submit row */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                {/* Response time note */}
                                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                                    <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
                                    Phản hồi trong vòng <strong className="font-semibold ml-1">24 giờ</strong>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isDisabled}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                                               bg-primary-color hover:opacity-90 active:scale-[0.98]
                                               disabled:opacity-50 disabled:pointer-events-none
                                               transition-all flex-shrink-0"
                                >
                                    {sent
                                        ? <><CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} /> Đã gửi!</>
                                        : <><SendOutlinedIcon sx={{ fontSize: 15 }} /> Gửi lời nhắn</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snack}
                autoHideDuration={3500}
                onClose={() => setSnack(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnack(false)}
                    severity="success"
                    sx={{ borderRadius: "12px", fontSize: 13 }}
                >
                    Tin nhắn đã được gửi! Chúng tôi sẽ sớm liên hệ lại.
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ContactPage;