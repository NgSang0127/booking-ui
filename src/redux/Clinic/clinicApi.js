import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "../api/baseQuery.js";

export const clinicApi = createApi({
    reducerPath: 'clinicApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Clinic'],
    endpoints: (builder) => ({
        getClinics: builder.query({
            query: ({ page = 0, size = 10 }) => `/api/clinics?page=${page}&size=${size}`,
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

        // Update Clinic (Mutation)
        updateClinic: builder.mutation({
            query: ({ clinicId, data }) => ({
                url: `/api/clinics/${clinicId}`,
                method: 'PUT',
                body: data,
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
    useUpdateClinicMutation
} = clinicApi;