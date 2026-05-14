import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from "stompjs";
import { useDispatch } from 'react-redux';
import { dashboardApi } from '../redux/Dashboard/dashboardApi';
import { useKeycloak } from '@react-keycloak/web'; // Giả sử dùng Keycloak

const WS_URL = "http://localhost:5000/api/notifications/ws";

const useNotificationWebsocket = (userId, type) => {
    const { keycloak } = useKeycloak();
    const dispatch = useDispatch();
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Chỉ kết nối khi có đủ userId và token
        if (!userId || !keycloak?.token) return;

        const sock = new SockJS(WS_URL);
        const stomp = Stomp.over(sock);
        stomp.debug = null; // Tắt log console nếu muốn

        // Header chứa JWT Token
        const headers = {
            Authorization: `Bearer ${keycloak.token}`
        };

        const onMessageReceive = (payload) => {
            const newNoti = JSON.parse(payload.body);
            console.log("🔔 New Notification:", newNoti);

            // Cập nhật cache dựa trên type
            const queryName = type === "user" ? 'getNotifications' : 'getNotificationsByClinic';
            const queryArg = type === "user" ? undefined : userId;

            dispatch(
                dashboardApi.util.updateQueryData(queryName, queryArg, (draft) => {
                    draft.unshift(newNoti);
                })
            );
        };

        stomp.connect(headers, () => {
            const topic = `/notification/${type}/${userId}`;
            stomp.subscribe(topic, onMessageReceive);
            console.log(`✅ Connected to WS: ${topic}`);
            setStompClient(stomp);
        }, (err) => {
            console.error("❌ WS Connection Error:", err);
            // Có thể thêm logic retry tại đây
        });

        return () => {
            if (stomp && stomp.connected) {
                stomp.disconnect(() => console.log("WS Disconnected"));
            }
        };
    }, [userId, type, keycloak?.token, dispatch]);

    return stompClient;
};

export default useNotificationWebsocket;