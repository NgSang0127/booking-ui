import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query: (category) => ({
                url: '/api/categories/clinic-owner',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),
        getAllCategories: builder.query({
            query: () => '/api/categories',
            providesTags: ['Category'],
        }),
        getCategoriesByClinic: builder.query({
            query: (clinicId) => `/api/categories/clinic/${clinicId}`,
            providesTags: ['Category'],
        }),
        getCategoryById: builder.query({
            query: (id) => `/api/categories/${id}`,
        }),
        updateCategory: builder.mutation({
            query: ({ id, category }) => ({
                url: `/api/categories/${id}`,
                method: 'PATCH',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/api/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useGetAllCategoriesQuery,
    useGetCategoriesByClinicQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;