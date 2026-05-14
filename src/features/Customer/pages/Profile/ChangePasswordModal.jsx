import React, {useState} from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    LinearProgress,
    TextField,
    Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {useChangePasswordMutation} from "../../../../redux/Auth/authApi";
import {useDispatch} from "react-redux";
import {showSnackbar} from "../../../../redux/uiSlice";
import LoaderManager from "../../../Loading/LoaderManager.jsx";

const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    return [
        { label: "",            color: "inherit",  pct: 0   },
        { label: "Yếu",         color: "error",    pct: 25  },
        { label: "Trung bình",  color: "warning",  pct: 50  },
        { label: "Khá",         color: "info",     pct: 75  },
        { label: "Mạnh",        color: "success",  pct: 100 },
    ][s];
};

const PwField = ({ label, name, value, show, onToggle, onChange, error, helperText }) => (
    <TextField
        fullWidth size="small" label={label}
        name={name} value={value}
        type={show ? "text" : "password"}
        onChange={onChange} error={!!error} helperText={helperText}
        InputProps={{
            startAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", mr: 1 }} />,
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton size="small" onClick={onToggle} edge="end">
                        {show
                            ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                            : <VisibilityOutlinedIcon   sx={{ fontSize: 16 }} />}
                    </IconButton>
                </InputAdornment>
            ),
        }}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 14 } }}
    />
);

export default function ChangePasswordModal({ open, onClose }) {
    const dispatch = useDispatch();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const [form, setForm]       = useState({ newPassword: "", confirmPassword: "" });
    const [show, setShow]       = useState({ new: false, confirm: false });
    const [error, setError]     = useState("");

    const strength = getStrength(form.newPassword);

    const reset = () => {
        setForm({ newPassword: "", confirmPassword: "" });
        setShow({ new: false, confirm: false });
        setError("");
    };

    const handleClose = () => { if (!isLoading) { reset(); onClose(); } };

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setError("");
    };

    const handleSubmit = async () => {
        if (form.newPassword.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự"); return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp"); return;
        }
        try {
            await changePassword({ newPassword: form.newPassword }).unwrap();
            dispatch(showSnackbar({ message: "Đổi mật khẩu thành công!", severity: "success" }));
            reset();
            onClose();
        } catch (e) {
            setError(e?.data?.message || "Đổi mật khẩu thất bại. Thử lại sau.");
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: "16px" } }}>

            {/* ── Header ── */}
            <DialogTitle sx={{ pb: 0.5 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{
                        width: 32, height: 32, borderRadius: "8px",
                        background: "linear-gradient(135deg, #0088ce, #00a68c)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <LockOutlinedIcon sx={{ fontSize: 16, color: "white" }} />
                    </Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                        Đổi mật khẩu
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: "16px !important", pb: 1 }}>

                {/* Error */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: "10px", fontSize: 13 }}>
                        {error}
                    </Alert>
                )}

                {/* New password */}
                <Box sx={{ mb: 1.5 }}>
                    <PwField
                        label="Mật khẩu mới" name="newPassword"
                        value={form.newPassword}
                        show={show.new}
                        onToggle={() => setShow((s) => ({ ...s, new: !s.new }))}
                        onChange={handleChange}
                    />
                </Box>

                {/* Strength bar */}
                {form.newPassword.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <LinearProgress
                            variant="determinate" value={strength.pct} color={strength.color}
                            sx={{ borderRadius: 1, height: 5 }}
                        />
                        <Typography variant="caption" color={`${strength.color}.main`}
                                    sx={{ mt: 0.5, display: "block" }}>
                            {strength.label}
                        </Typography>
                    </Box>
                )}

                {/* Confirm password */}
                <PwField
                    label="Xác nhận mật khẩu mới" name="confirmPassword"
                    value={form.confirmPassword}
                    show={show.confirm}
                    onToggle={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                    onChange={handleChange}
                    error={
                        form.confirmPassword.length > 0 &&
                        form.newPassword !== form.confirmPassword
                    }
                    helperText={
                        form.confirmPassword.length > 0 &&
                        form.newPassword !== form.confirmPassword
                            ? "Mật khẩu không khớp" : ""
                    }
                />
            </DialogContent>

            {/* ── Actions ── */}
            <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
                <Button fullWidth onClick={handleClose} disabled={isLoading}
                        sx={{
                            borderRadius: "10px", textTransform: "none", fontSize: 14,
                            border: "0.5px solid", borderColor: "divider", color: "text.secondary",
                        }}>
                    Hủy
                </Button>
                <Button fullWidth onClick={handleSubmit} disabled={isLoading}
                        variant="contained" disableElevation
                        startIcon={isLoading ? <LoaderManager fullScreen={false} size={0.5}/> : null}
                        sx={{
                            borderRadius: "10px", textTransform: "none", fontSize: 14,
                            fontWeight: 600, bgcolor: "#0088ce",
                            "&:hover": { bgcolor: "#006ba3" },
                        }}>
                    {isLoading ? "Đang lưu..." : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}