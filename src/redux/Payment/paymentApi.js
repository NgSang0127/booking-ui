import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        proceedPayment: builder.mutation({
            query: ({ paymentId, paymentLinkId }) => ({
                url: '/api/payments/proceed',
                method: 'PATCH',
                params: { paymentId, paymentLinkId },
            }),
        }),
    }),
});

export const { useProceedPaymentMutation } = paymentApi