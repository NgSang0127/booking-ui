import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Notification', 'Chart'],
    endpoints: (builder) => ({
        // Notifications
        getNotifications: builder.query({
            query: () => '/api/notifications',
            providesTags: ['Notification'],
        }),
        getNotificationsByClinic: builder.query({
            query: (clinicId) => `/api/notifications/clinic-owner/clinic/${clinicId}`,
            providesTags: ['Notification'],
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/api/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),

        // Charts
        getEarningChart: builder.query({
            query: () => '/api/bookings/chart/earnings',
        }),
        getBookingChart: builder.query({
            query: () => '/api/bookings/chart/bookings',
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetNotificationsByClinicQuery,
    useMarkAsReadMutation,
    useGetEarningChartQuery,
    useGetBookingChartQuery
} = dashboardApi;