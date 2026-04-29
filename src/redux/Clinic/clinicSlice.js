import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../config/api";

export const createClinic = createAsyncThunk(
    'clinic/createClinic',
    async (reqData, { rejectWithValue }) => {
        try {
            // 1. Signup chủ Clinic
            const authRes = await api.post(`/auth/signup`, reqData.ownerDetails);
            const token = authRes.data.data.jwt;
            localStorage.setItem("accessToken", token);

            // 2. Tạo Clinic với token mới
            const { data } = await api.post('/api/clinics', reqData.clinicDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 3. Điều hướng
            reqData.navigate("/clinic-dashboard");

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const clinicSlice = createSlice({
    name: 'clinic',
    initialState: {
        currentClinic: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        // CẬP NHẬT: Thêm setClinic để lưu data từ API vào Store
        setClinic: (state, action) => {
            state.currentClinic = action.payload;
            state.error = null;
        },
        clearClinicState: (state) => {
            state.currentClinic = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createClinic.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createClinic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentClinic = action.payload;
                state.error = null;
            })
            .addCase(createClinic.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});


export const { setClinic, clearClinicState } = clinicSlice.actions;
export default clinicSlice.reducer;