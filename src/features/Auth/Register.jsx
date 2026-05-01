import React from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Button, Grid, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useRegisterMutation} from "../../redux/Auth/authApi";
import {showSnackbar} from "../../redux/uiSlice";
import {useKeycloak} from "@react-keycloak/web";
import LoadingManager from "../Loading/LoaderManager.jsx";

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
};

const validationSchema = Yup.object({
    firstName: Yup.string().required("Tên là bắt buộc"),
    lastName: Yup.string().required("Họ là bắt buộc"),
    email: Yup.string().email("Định dạng email không hợp lệ").required("Email là bắt buộc"),
    password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc"),
    phone: Yup.string().matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").min(10, "Tối thiểu 10 số"),
});

const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
    "& .MuiFormHelperText-root": { marginLeft: "4px" }
};

const RegistrationForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { keycloak } = useKeycloak();
    const [register, { isLoading }] = useRegisterMutation();

    const handleSubmit = async (values) => {
        // Tách logic để phù hợp với Backend của bạn
        const finalValues = {
            ...values,
            // Keycloak thường cần username, lấy email làm username là cách phổ biến
            username: values.email,
            role: "CUSTOMER" // Mặc định role cho người dùng mới
        };

        try {
            await register(finalValues).unwrap();

            dispatch(showSnackbar({
                message: "Đăng ký thành công! Vui lòng đăng nhập.",
                severity: "success"
            }));

            // Sau khi tạo xong ở DB và Keycloak qua Backend,
            // đẩy user sang trang login chính thức của Keycloak
            setTimeout(() => {
                keycloak.login();
            }, 1500);

        } catch (error) {
            dispatch(showSnackbar({
                message: error?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại!",
                severity: "error"
            }));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
                <p className="text-sm text-gray-500 mt-1">Join us to book appointments with ease</p>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="flex flex-col gap-4">
                        {/* Chia 2 cột cho Họ và Tên */}
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    disabled={isLoading}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    sx={fieldSx}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    disabled={isLoading}
                                    error={touched.lastName && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={fieldSx}
                                />
                            </Grid>
                        </Grid>

                        <Field
                            as={TextField}
                            fullWidth
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            disabled={isLoading}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={fieldSx}
                        />

                        <Field
                            as={TextField}
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            disabled={isLoading}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                            sx={fieldSx}
                        />

                        <Field
                            as={TextField}
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={fieldSx}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                mt: 1,
                                height: "48px",
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "1rem"
                            }}
                        >
                            {isLoading ? (
                                <LoadingManager fullScreen={false} size={0.5}/>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </Form>
                )}
            </Formik>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <button
                    onClick={() => keycloak.login()}
                    className="font-semibold text-blue-600 hover:underline"
                    disabled={isLoading}
                >
                    Sign in
                </button>
            </p>
        </div>
    );
};

export default RegistrationForm;