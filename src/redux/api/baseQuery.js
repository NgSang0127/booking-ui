// import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import keycloak from '../../keycloak/keycloak';
//
// const API_BASE_URL = 'http://localhost:5000';
//
// const rawBaseQuery = fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: async (headers) => {
//         // 1. Kiểm tra xem keycloak object có tồn tại không
//         if (!keycloak) {
//             console.error("[BaseQuery] Keycloak object is undefined!");
//             return headers;
//         }
//
//         // 2. Kiểm tra xem user đã login thực sự chưa
//         if (keycloak.authenticated) {
//             try {
//                 // 3. Ép refresh token, nếu không refresh được (ví dụ hết hạn hoàn toàn)
//                 // thì nó sẽ nhảy vào catch
//                 await keycloak.updateToken(30);
//
//                 const token = keycloak.token;
//                 if (token) {
//                     headers.set('Authorization', `Bearer ${token}`);
//                     // Console này để bạn copy token ra check jwt.io
//                     // console.log("[BaseQuery] Token sent:", token);
//                 }
//             } catch (error) {
//                 console.error("[BaseQuery] Token update failed or session expired", error);
//             }
//         } else {
//             console.warn("[BaseQuery] User not authenticated, no token added to headers.");
//         }
//         return headers;
//     },
// });
//
// export const baseQueryWithReauth = async (args, api, extraOptions) => {
//     let result = await rawBaseQuery(args, api, extraOptions);
//
//     if (result.error && result.error.status === 401) {
//         console.warn("API 401 detected but skipping auto-logout to prevent loops");
//         // keycloak.logout(); // TẠM THỜI COMMENT DÒNG NÀY ĐỂ TEST
//     }
//
//     return result;
// };

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import keycloak from '../../keycloak/keycloak';

export const baseQueryWithReauth = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    prepareHeaders: async (headers) => {
        if (keycloak.authenticated) {
            try {
                await keycloak.updateToken(60);
                headers.set('Authorization', `Bearer ${keycloak.token}`);
            } catch {
                keycloak.login();
            }
        }
        return headers;
    },
});