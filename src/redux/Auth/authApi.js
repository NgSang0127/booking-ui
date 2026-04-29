import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
        }),

        getUserProfile: builder.query({
            query: () => '/api/users/profile',
            providesTags: ['User'],
        }),
        getUserById: builder.query({
            query: (userId) => `/api/users/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
        }),
        getAllUsers: builder.query({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: '/api/users',
                params: { page, size },
            }),
            providesTags: (result) =>
                result
                    ? [...result.content.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        changePassword:builder.mutation({
            query: (userData) =>({
                url: '/api/users/profile/change-password',
                method: 'PUT',
                body: userData
            })
        }),
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: '/api/users/profile',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useGetUserProfileQuery,
    useGetUserByIdQuery,
    useGetAllUsersQuery,
    useChangePasswordMutation,
    useUpdateProfileMutation,
} = authApi;