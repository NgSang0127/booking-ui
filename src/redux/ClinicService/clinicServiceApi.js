import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const clinicServiceApi = createApi({
    reducerPath: 'clinicServiceApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Service'],
    endpoints: (builder) => ({
        createService: builder.mutation({
            query: (service) => ({
                url: '/api/service-offering/clinic-owner',
                method: 'POST',
                body: service,
            }),
            invalidatesTags: ['Service'],
        }),
        updateService: builder.mutation({
            query: ({ id, service }) => ({
                url: `/api/service-offering/clinic-owner/${id}`,
                method: 'PATCH',
                body: service,
            }),
            invalidatesTags: ['Service'],
        }),
        getServicesByClinic: builder.query({
            query: ({ clinicId, categoryId }) => ({
                url: `/api/service-offering/clinic/${clinicId}`,
                params: { categoryId },
            }),
            providesTags: ['Service'],
        }),
        getServiceById: builder.query({
            query: (id) => `/api/service-offering/${id}`,
        }),
    }),
});

export const {
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useGetServicesByClinicQuery,
    useGetServiceByIdQuery
} = clinicServiceApi;