import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "../api/baseQuery.js";

export const clinicApi = createApi({
    reducerPath: 'clinicApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Clinic'],
    endpoints: (builder) => ({
        getClinics: builder.query({
            query: ({ page = 0, size = 10,status='' }) => `/api/clinics?page=${page}&size=${size}${status ? `&status=${status}` : ''}`,
            providesTags: ['Clinic'],
        }),
        getClinicById: builder.query({
            query: (id) => `/api/clinics/${id}`,
            providesTags: (result, error, id) => [{ type: 'Clinic', id }],
        }),
        getClinicByOwner: builder.query({
            query: () => `/api/clinics/owner`,
            providesTags: ['Clinic'],
        }),
        searchClinics: builder.query({
            query: (city) => `/api/clinics/search?city=${city}`,
        }),

        updateClinic: builder.mutation({
            query: ({ clinicId, data }) => ({
                url: `/api/clinics/${clinicId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Clinic'],
        }),
        approveClinic: builder.mutation({
            query: ({ clinicId, status, reason }) => ({
                url: `/api/clinics/${clinicId}/approval`,
                method: 'PUT',
                body: { status, reason },
            }),
            invalidatesTags: ['Clinic'],
        }),
    }),
});

export const {
    useGetClinicsQuery,
    useGetClinicByIdQuery,
    useGetClinicByOwnerQuery,
    useSearchClinicsQuery,
    useUpdateClinicMutation,
    useApproveClinicMutation,
} = clinicApi;