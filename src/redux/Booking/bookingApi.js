import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Booking', 'Report', 'Slots'],
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: ({ clinicId, bookingData }) => ({
                url: '/api/bookings',
                method: 'POST',
                body: bookingData,
                params: { clinicId, paymentMethod: "STRIPE" },
            }),
            invalidatesTags: ['Booking', 'Report'],
        }),
        fetchCustomerBookings: builder.query({
            query: () => '/api/bookings/customer',
            providesTags: ['Booking'],
        }),
        fetchClinicBookings: builder.query({
            query: () => '/api/bookings/clinic',
            providesTags: ['Booking'],
        }),
        fetchBookingById: builder.query({
            query: (bookingId) => `/api/bookings/${bookingId}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
        updateBookingStatus: builder.mutation({
            query: ({ bookingId, status }) => ({
                url: `/api/bookings/${bookingId}/status`,
                method: 'PUT',
                params: { status },
            }),
            invalidatesTags: ['Booking', 'Report'],
        }),
        getClinicReport: builder.query({
            query: () => '/api/bookings/report',
            providesTags: ['Report'],
        }),
        fetchBookedSlots: builder.query({
            query: ({ clinicId, date }) => `/api/bookings/slots/clinic/${clinicId}/date/${date}`,
            providesTags: ['Slots'],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useFetchCustomerBookingsQuery,
    useFetchClinicBookingsQuery,
    useFetchBookingByIdQuery,
    useUpdateBookingStatusMutation,
    useGetClinicReportQuery,
    useFetchBookedSlotsQuery
} = bookingApi;