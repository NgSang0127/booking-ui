import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        getClinicReviews: builder.query({
            query: (clinicId) => `/api/reviews/clinic/${clinicId}`,
            providesTags: ['Review'],
        }),
        createReview: builder.mutation({
            query: ({ clinicId, reviewData }) => ({
                url: `/api/reviews/clinic/${clinicId}`,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['Review'],
        }),
        updateReview: builder.mutation({
            query: ({ reviewId, reviewData }) => ({
                url: `/api/reviews/${reviewId}`,
                method: 'PATCH',
                body: reviewData,
            }),
            invalidatesTags: ['Review'],
        }),
        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `/api/reviews/${reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});

export const {
    useGetClinicReviewsQuery,
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation
} = reviewApi;