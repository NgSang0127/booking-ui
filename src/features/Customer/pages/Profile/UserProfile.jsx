import React, {useState} from "react";
import {useGetUserProfileQuery, useUpdateProfileMutation} from "../../../../redux/Auth/authApi";
import {useDispatch} from "react-redux";
import ChangePasswordModal from "./ChangePasswordModal";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import {showSnackbar} from "../../../../redux/uiSlice";
import {Avatar, Box, Button, Chip, Divider, IconButton, Skeleton, TextField, Typography} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const Field = ({ icon, label, value, editMode, name, onChange, type = "text" }) => (
    <Box>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary",
            textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.75 }}>
            {label}
        </Typography>
        {editMode ? (
            <TextField
                fullWidth size="small" type={type} name={name}
                value={value || ""} onChange={onChange}
                InputProps={{ startAdornment: React.cloneElement(icon, { sx: { fontSize: 16, color: "text.disabled", mr: 1 } }) }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px", fontSize: 14,
                        "&:hover fieldset": { borderColor: "primary.main" },
                    }
                }}
            />
        ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25,
                px: 1.5, py: 1, borderRadius: "10px",
                border: "0.5px solid", borderColor: "divider",
                bgcolor: "background.default" }}>
                {React.cloneElement(icon, { sx: { fontSize: 16, color: "text.disabled" } })}
                <Typography sx={{ fontSize: 14, color: value ? "text.primary" : "text.disabled" }}>
                    {value || "Chưa cập nhật"}
                </Typography>
            </Box>
        )}
    </Box>
);

const UserProfile = () => {
    const dispatch = useDispatch();
    const { data: user, isLoading } = useGetUserProfileQuery();
    const [openChangePw, setOpenChangePw] = useState(false);
    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});

    const handleEdit = () => {
        setForm({
            fullName: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            password: "",
        });
        setEditMode(true);
    };

    const handleCancel = () => { setEditMode(false); setForm({}); };

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        try {
            const payload = { ...form };
            if (!payload.password) delete payload.password;
            await updateProfile(payload).unwrap();
            dispatch(showSnackbar({ message: "Cập nhật thành công!", severity: "success" }));
            setEditMode(false);
        } catch (err) {
            dispatch(showSnackbar({ message: err?.data?.message || "Cập nhật thất bại!", severity: "error" }));
        }
    };

    if (isLoading) return (
        <Box sx={{ maxWidth: 640, mx: "auto", p: 4 }}>
            {[...Array(4)].map((_, i) => <Skeleton key={i} height={60} sx={{ mb: 2, borderRadius: 2 }} />)}
        </Box>
    );

    const initials = user?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
    const roleLabelMap = { OWNER: "Clinic Owner", CUSTOMER: "Member", ADMIN: "Admin" };

    return (
        <Box sx={{ maxWidth: 640, mx: "auto" }}>
            {/* Header card */}
            <Box sx={{
                background: "linear-gradient(135deg, rgba(0,136,206,0.06) 0%, rgba(0,166,140,0.06) 100%)",
                border: "0.5px solid", borderColor: "divider",
                borderRadius: "16px", p: 3, mb: 3,
                display: "flex", alignItems: "center", gap: 3,
            }}>
                <Box sx={{ position: "relative" }}>
                    <Avatar sx={{
                        width: 72, height: 72, borderRadius: "16px",
                        background: "linear-gradient(135deg, #0088ce, #00a68c)",
                        fontSize: 24, fontWeight: 700,
                        border: "3px solid white", boxShadow: "0 4px 12px rgba(0,136,206,0.2)",
                    }}>
                        {initials}
                    </Avatar>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                        {user?.fullName}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
                        {user?.email}
                    </Typography>
                    <Chip
                        label={roleLabelMap[user?.role] || user?.role}
                        size="small"
                        sx={{
                            mt: 1, fontSize: 11, fontWeight: 600, height: 22,
                            bgcolor: user?.role === "OWNER" ? "rgba(0,166,140,0.1)" : "rgba(0,136,206,0.1)",
                            color: user?.role === "OWNER" ? "#00a68c" : "#0088ce",
                            borderRadius: "6px",
                        }}
                    />
                </Box>
                {!editMode && (
                    <IconButton
                        onClick={handleEdit}
                        sx={{ borderRadius: "10px", border: "0.5px solid", borderColor: "divider",
                            bgcolor: "white", width: 38, height: 38 }}
                    >
                        <EditOutlinedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                )}
            </Box>

            {/* Info card */}
            <Box sx={{
                bgcolor: "white", border: "0.5px solid", borderColor: "divider",
                borderRadius: "16px", overflow: "hidden",
            }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: "0.5px solid", borderColor: "divider",
                    display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
                        Thông tin cá nhân
                    </Typography>
                    {editMode && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" onClick={handleCancel}
                                    startIcon={<CloseOutlinedIcon sx={{ fontSize: 15 }} />}
                                    sx={{ borderRadius: "8px", textTransform: "none", fontSize: 13,
                                        color: "text.secondary", border: "0.5px solid", borderColor: "divider" }}>
                                Hủy
                            </Button>
                            <Button size="small" onClick={handleSave} disabled={isSaving}
                                    startIcon={isSaving ? <LoaderManager fullScreen={false} size={0.5}/> : <SaveOutlinedIcon sx={{ fontSize: 15 }} />}
                                    variant="contained" disableElevation
                                    sx={{ borderRadius: "8px", textTransform: "none", fontSize: 13,
                                        bgcolor: "#0088ce", "&:hover": { bgcolor: "#006ba3" } }}>
                                Lưu thay đổi
                            </Button>
                        </Box>
                    )}
                </Box>

                <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <Field icon={<Person2OutlinedIcon />} label="Họ và tên"
                           name="fullName" value={editMode ? form.fullName : user?.fullName}
                           editMode={editMode} onChange={handleChange} />
                    <Field icon={<EmailOutlinedIcon />} label="Email"
                           name="email" value={editMode ? form.email : user?.email}
                           editMode={editMode} onChange={handleChange} type="email" />
                    <Field icon={<PhoneOutlinedIcon />} label="Số điện thoại"
                           name="phone" value={editMode ? form.phone : user?.phone}
                           editMode={editMode} onChange={handleChange} />
                    <Field icon={<BadgeOutlinedIcon />} label="Vai trò"
                           value={roleLabelMap[user?.role] || user?.role}
                           editMode={false} onChange={() => {}} />

                    {editMode && (
                        <>
                            <Divider sx={{ borderColor: "divider" }} />
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                                px: 1.5, py: 1.25, borderRadius: "10px",
                                border: "0.5px solid", borderColor: "divider",
                                bgcolor: "background.default" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <LockOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                                    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                                        Mật khẩu
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<KeyOutlinedIcon sx={{ fontSize: 14 }} />}
                                    onClick={() => setOpenChangePw(true)}
                                    sx={{
                                        borderRadius: "8px", textTransform: "none", fontSize: 12,
                                        color: "#0088ce", border: "0.5px solid #0088ce",
                                        px: 1.5, py: 0.5,
                                    }}>
                                    Đổi mật khẩu
                                </Button>
                            </Box>
                        </>
                    )}
                    <ChangePasswordModal
                        open={openChangePw}
                        onClose={() => setOpenChangePw(false)}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfile;