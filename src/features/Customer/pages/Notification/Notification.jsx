import React from "react";
import {useSelector} from "react-redux";
import NotificationCard from "./NotificationCard.jsx";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {Box, Typography} from "@mui/material";
import useNotificationWebsocket from "../../../../util/useNotificationWebsocket.jsx";
import {useGetNotificationsQuery} from "../../../../redux/dashboard/dashboardApi.js";
import EmptyState from "../../../../components/common/EmptyState.jsx";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const Notification = ({ type = "user" }) => {
    // 2. Lấy thông tin user hiện tại
    const user = useSelector((state) => state.auth.user);

    const {
        data: notifications = [],
        isLoading,
        isError
    } = useGetNotificationsQuery(undefined, {
        skip: !user?.id,
    });

    useNotificationWebsocket(user?.id, type);

    // Tính toán số lượng chưa đọc
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="">
            <div className="max-w-2xl mx-auto px-5 py-12">

                {/* Header Section */}
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Thông báo</h1>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            {unreadCount > 0
                                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                                : "Bạn đã xem hết tất cả thông báo"}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="text-xs font-bold text-primary-color hover:underline underline-offset-4">
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                {/* Main Content Area */}
                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={15}>
                        <LoaderManager fullScreen={false}/>
                    </Box>
                ) : isError ? (
                    <Box textAlign="center" py={10} bgcolor="white" borderRadius="24px" border="1px solid #fee2e2">
                        <Typography color="error" fontWeight={600}>
                            Không thể kết nối đến máy chủ thông báo.
                        </Typography>
                    </Box>
                ) : notifications.length === 0 ? (
                    <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center">
                        <EmptyState
                            icon={<NotificationsNoneIcon sx={{ fontSize: 64, color: 'divider' }} />}
                            title="Chưa có thông báo nào"
                            description="Tất cả thông báo về lịch hẹn và tài khoản của bạn sẽ xuất hiện tại đây."
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((item) => (
                            <div key={item.id} className="animate-slide-up">
                                <NotificationCard type={type} item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;