import React, {useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Box, Modal} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";

import {useGetServicesByClinicQuery} from "../../../../../redux/ClinicService/clinicServiceApi";
import {useGetCategoriesByClinicQuery} from "../../../../../redux/Category/categoryApi";
import {useCreateBookingMutation, useFetchBookedSlotsQuery} from "../../../../../redux/Booking/bookingApi";
import {showSnackbar} from "../../../../../redux/uiSlice";
import CategoryCard from "./CategoryCard.jsx";
import ServiceCard from "./ServiceCard.jsx";
import SelectedServiceList from "./SelectedServiceList.jsx";
import {isServiceSelected} from "../../../../../util/isServiceSelected.js";
import EmptyState from "../../../../../components/common/EmptyState.jsx";
import LoaderManager from "../../../../Loading/LoaderManager.jsx";

const ClinicServiceDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [bookingData, setBookingData] = useState({ services: [], time: null });
    const [isModalOpen, setOpenModal] = useState(false);

    const { data: categories = [] } = useGetCategoriesByClinicQuery(id, { skip: !id });
    const { data: services = [], isLoading: isLoadingServices } = useGetServicesByClinicQuery({
        clinicId: id,
        categoryId: selectedCategory || undefined
    }, { skip: !id });

    const selectedDate = bookingData.time
        ? dayjs(bookingData.time).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");

    const { data: bookedSlots = [] } = useFetchBookedSlotsQuery({ clinicId: id, date: selectedDate }, { skip: !id });
    const [createBooking, { isLoading: isBookingInProgress }] = useCreateBookingMutation();

    const handleSelectService  = (svc) => setBookingData(p => ({ ...p, services: [...p.services, svc] }));
    const handleRemoveService  = (sid) => setBookingData(p => ({ ...p, services: p.services.filter(s => s.id !== sid) }));

    const totalPrice = useMemo(() =>
            bookingData.services.reduce((sum, s) => sum + (s.price || 0), 0),
        [bookingData.services]);

    const handleConfirmBooking = async () => {
        try {
            const res = await createBooking({
                clinicId: id,
                bookingData: {
                    serviceIds: bookingData.services.map(s => s.id),
                    startTime: dayjs(bookingData.time).format("YYYY-MM-DDTHH:mm:ss"),
                }
            }).unwrap();

            if (res.payment_link_url) {
                window.location.href = res.payment_link_url;
            }
        } catch (error) {
            dispatch(showSnackbar({
                message: error?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại!",
                severity: "error"
            }));
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Sidebar: Categories ── */}
            <aside className="w-full lg:w-[220px] flex-shrink-0">
                <div className="sticky top-28">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 px-1 mb-2">
                        Danh mục
                    </p>
                    <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        <CategoryCard
                            selectedCategory={selectedCategory}
                            handleSelectCategory={(id) => setSelectedCategory(id)}
                            item={{
                                id: null,
                                name: "Tất cả",
                                image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg"
                            }}
                        />
                        {categories.map((item) => (
                            <CategoryCard
                                key={item.id}
                                selectedCategory={selectedCategory}
                                handleSelectCategory={(id) => setSelectedCategory(id)}
                                item={item}
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* ── Main: Service list ── */}
            <main className="flex-1 min-w-0">
                {isLoadingServices ? (
                    <div className="flex justify-center py-16">
                        <LoaderManager fullScreen={false}/>
                    </div>
                ) : services.length === 0 ? (
                    <EmptyState
                        title="Chưa có dịch vụ"
                        description="Danh mục này hiện chưa có dịch vụ nào khả dụng."
                    />
                ) : (
                    <div className="space-y-3">
                        {services.map((item) => (
                            <ServiceCard
                                key={item.id}
                                onRemove={handleRemoveService}
                                onSelect={handleSelectService}
                                service={item}
                                isSelected={isServiceSelected(bookingData.services, item.id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Cart ── */}
            <aside className="w-full lg:w-[280px] flex-shrink-0">
                <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-5 space-y-4">

                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Dịch vụ đã chọn</p>
                            {bookingData.services.length > 0 && (
                                <p className="text-[11px] text-gray-400">{bookingData.services.length} dịch vụ</p>
                            )}
                        </div>
                    </div>

                    {bookingData.services.length > 0 ? (
                        <>
                            <SelectedServiceList
                                handleRemoveService={handleRemoveService}
                                services={bookingData.services}
                            />

                            <div className="border-t border-dashed border-gray-200 pt-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                                        Tạm tính
                                    </p>
                                    <p className="text-lg font-bold text-primary-color">
                                        ₫{totalPrice.toLocaleString("vi-VN")}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpenModal(true)}
                                className="w-full flex items-center justify-center gap-2
                                           bg-primary-color text-white text-sm font-semibold
                                           py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98]
                                           transition-all"
                            >
                                <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                                Đặt lịch ngay
                            </button>
                        </>
                    ) : (
                        <div className="py-8 text-center space-y-2">
                            <RemoveShoppingCartOutlinedIcon sx={{ fontSize: 32, color: "#D1D5DB" }} />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Vui lòng chọn ít nhất một dịch vụ để tiếp tục
                            </p>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Booking Modal ── */}
            <Modal open={isModalOpen} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "92%", sm: 560 },
                    bgcolor: "background.paper",
                    borderRadius: "20px",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
                    outline: "none",
                    overflow: "hidden",
                }}>
                    {/* Modal header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Xác nhận đặt lịch</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Chọn thời gian bạn muốn khám bệnh</p>
                        </div>
                        <button
                            onClick={() => setOpenModal(false)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center
                                       text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </button>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Booked slots */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: "#9ca3af" }} />
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                    Giờ đã được đặt
                                </p>
                            </div>
                            <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                                {bookedSlots.length > 0 ? (
                                    bookedSlots.map((slot, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2
                                                                  bg-red-50 border border-red-100 rounded-xl">
                                            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                                            <span className="text-xs font-semibold text-red-600">
                                                {dayjs(slot.startTime).format("HH:mm")} – {dayjs(slot.endTime).format("HH:mm")}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-3
                                                    bg-green-50 border border-green-100 rounded-xl">
                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 15, color: "#22C55E" }} />
                                        <span className="text-xs font-semibold text-green-700">
                                            Tất cả các khung giờ còn trống
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Time picker & action */}
                        <div className="space-y-4">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Chọn ngày & giờ khám"
                                    value={bookingData.time ? dayjs(bookingData.time) : null}
                                    onChange={(val) => setBookingData(p => ({
                                        ...p,
                                        time: val ? val.format("YYYY-MM-DDTHH:mm:ss") : null
                                    }))}
                                    sx={{
                                        width: "100%",
                                        "& .MuiOutlinedInput-root": { borderRadius: "12px", fontSize: 13 },
                                    }}
                                />
                            </LocalizationProvider>

                            {/* Summary */}
                            {bookingData.services.length > 0 && (
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                        Tóm tắt
                                    </p>
                                    {bookingData.services.map(s => (
                                        <div key={s.id} className="flex justify-between text-xs">
                                            <span className="text-gray-600 truncate mr-2">{s.name}</span>
                                            <span className="font-semibold text-gray-800 flex-shrink-0">
                                                ₫{s.price?.toLocaleString("vi-VN")}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-200 pt-1.5 flex justify-between">
                                        <span className="text-xs font-bold text-gray-500">Tổng</span>
                                        <span className="text-sm font-bold text-primary-color">
                                            ₫{totalPrice.toLocaleString("vi-VN")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700
                                       px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={!bookingData.time || isBookingInProgress}
                            className="flex items-center gap-2 text-sm font-semibold text-white
                                       bg-primary-color hover:opacity-90 disabled:opacity-50
                                       disabled:pointer-events-none px-5 py-2 rounded-xl
                                       transition-all active:scale-[0.98]"
                        >
                            {isBookingInProgress ? (
                                <LoaderManager fullScreen={false} size={0.5}/>
                            ) : (
                                <PaymentOutlinedIcon sx={{ fontSize: 15 }} />
                            )}
                            {isBookingInProgress ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default ClinicServiceDetails;