import React from "react";
import * as Yup from "yup";

const initialValues = { email: "", password: "" };

const validationSchema = Yup.object({
    email: Yup.string().email("Định dạng email không hợp lệ").required("Email là bắt buộc"),
    password: Yup.string().required("Mật khẩu là bắt buộc"),
});

const LoginForm = () => {

    return (
        <div className="space-y-6">
        
        </div>
    );
};

export default LoginForm;