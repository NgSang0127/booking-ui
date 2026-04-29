import {configureStore} from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice';
import clinicReducer from './Clinic/clinicSlice';
import uiReducer from './uiSlice';
import {clinicApi} from './Clinic/clinicApi.js';
import {bookingApi} from './Booking/bookingApi';
import {categoryApi} from './Category/categoryApi';
import {clinicServiceApi} from './ClinicService/clinicServiceApi';
import {reviewApi} from './Review/reviewApi';
import {dashboardApi} from './Dashboard/dashboardApi';
import {paymentApi} from './Payment/paymentApi';
import {authApi} from "./Auth/authApi.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        clinic: clinicReducer,
        ui: uiReducer,
        [authApi.reducerPath]: authApi.reducer,
        [clinicApi.reducerPath]: clinicApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [clinicServiceApi.reducerPath]: clinicServiceApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            clinicApi.middleware,
            bookingApi.middleware,
            categoryApi.middleware,
            clinicServiceApi.middleware,
            reviewApi.middleware,
            dashboardApi.middleware,
            paymentApi.middleware
        ),
});