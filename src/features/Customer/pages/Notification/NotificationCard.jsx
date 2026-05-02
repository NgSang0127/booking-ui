import React from "react";
import {useNavigate} from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {Box, Typography} from "@mui/material";
import {useMarkAsReadMutation} from "../../../../redux/Dashboard/dashboardApi";


const NotificationCard = ({item, type}) => {
    const navigate = useNavigate();


    // 2. Sử dụng Mutation Hook
    const [markAsRead] = useMarkAsReadMutation();

    // Kiểm tra trạng thái chưa đọc (Backend thường dùng 'read' hoặc 'isRead')
    const isUnread = !item.read;

    const handleNotificationClick = async () => {
        try {
            // 3. Đánh dấu đã đọc thông qua API nếu là thông báo chưa đọc
            if (isUnread) {
                await markAsRead(item.id).unwrap();
            }

            // 4. Điều hướng thông minh dựa trên nội dung thông báo
            if (type === "user") {
                navigate("/bookings");
            } else if (type === "clinic") {
                navigate("/clinic-dashboard/bookings");
            }
        } catch (error) {
            console.error("Lỗi khi đánh dấu thông báo:", error);
            // Không nhất thiết phải hiện Snackbar cho lỗi này để tránh làm phiền người dùng
        }
    };

    return (
        <div
            onClick={handleNotificationClick}
            className={`
                flex items-start gap-4 p-5 rounded-[24px] border cursor-pointer transition-all duration-300 group
                ${isUnread
                ? "bg-white border-primary-color/20 shadow-md ring-1 ring-primary-color/5"
                : "bg-gray-50/50 border-gray-100 hover:bg-white hover:border-gray-200"
            }
            `}
        >
            {/* Icon Section */}
            <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110
                ${isUnread
                ? "bg-primary-color text-white shadow-lg shadow-primary-color/20"
                : "bg-white text-gray-400 border border-gray-100"
            }
            `}>
                <NotificationsIcon sx={{fontSize: 24}}/>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <Typography
                        variant="body2"
                        sx={{
                            lineHeight: 1.6,
                            fontWeight: isUnread ? 800 : 500,
                            color: isUnread ? 'text.primary' : 'text.secondary'
                        }}
                    >
                        {item.description}
                    </Typography>

                    {/* Unread Dot Indicator */}
                    {isUnread && (
                        <Box sx={{
                            width: 10, h: 10, bgcolor: 'primary.main',
                            borderRadius: '50%', mt: 1, flexShrink: 0,
                            boxShadow: '0 0 0 4px rgba(0, 136, 206, 0.1)'
                        }}/>
                    )}
                </div>

                {/* Sub-info: Services Tags */}
                {item.booking?.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.booking.services.map((service) => (
                            <span
                                key={service.id}
                                className="text-[10px] font-bold uppercase tracking-tight bg-white border border-gray-100 text-gray-500 px-2 py-0.5 rounded-lg"
                            >
                                {service.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Time Info (Optional but recommended) */}
                <div className="flex items-center gap-1.5 pt-1">
                    <CalendarTodayIcon sx={{fontSize: 12, color: 'text.disabled'}}/>
                    <Typography variant="caption" sx={{color: 'text.disabled', fontWeight: 600}}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "Vừa xong"}
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard