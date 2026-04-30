import React, { useEffect, useState } from "react";
import { Badge, Button, IconButton, Menu, MenuItem, Divider, Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import useNotificationWebsoket from "../../../../util/useNotificationWebsocket.jsx";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from '@mui/icons-material/Logout';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useGetNotificationsQuery } from "../../../../redux/dashboard/dashboardApi.js";
import { useKeycloak } from '@react-keycloak/web';
import { clearUser } from "../../../../redux/Auth/authSlice";

const Navbar = () => {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useTheme();

    const user = useSelector((state) => state.auth.user);
    const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
        skip: !user?.id,
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const open = Boolean(anchorEl);

    const navLinks = [
        { title: "Home", path: "/" },
        { title: "About", path: "/about" },
        { title: "Services", path: "/services" },
        { title: "Contact", path: "/contact" },
    ];

    const menuItems = [
        {
            icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#0088ce" }} />,
            iconBg: "rgba(0,136,206,0.08)",
            label: "My Appointments",
            sub: "View & manage bookings",
            path: "/bookings",
        },
        ...((user?.role === "OWNER" || user?.role === "ADMIN") ? [{
            icon: <DashboardOutlinedIcon sx={{ fontSize: 16, color: "#00a68c" }} />,
            iconBg: "rgba(0,166,140,0.08)",
            label: user.role === "ADMIN" ? "Admin Panel" : "Clinic Dashboard",
            sub: user.role === "ADMIN" ? "System management" : "Manage your clinic",
            path: user.role === "ADMIN" ? "/admin" : "/clinic-dashboard",
        }] : []),
        {
            icon: <Person2OutlinedIcon sx={{ fontSize: 16, color: "#3b518a" }} />,
            iconBg: "rgba(0,0,0,0.04)",
            label: "Profile Settings",
            sub: "Update your information",
            path: "/profile",
        },
    ];

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMenuClick = (path) => () => {
        if (path === "/logout") {
            dispatch(clearUser());
            keycloak.logout({ redirectUri: window.location.origin });
        } else {
            navigate(path);
        }
        handleClose();
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useNotificationWebsoket(user?.id, "user");

    return (
        <nav className={`z-50 px-6 lg:px-12 flex items-center justify-between py-4 fixed top-0 left-0 right-0 transition-all duration-500 ${
            scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}>

            {/* LEFT: LOGO (Cố định width để căn giữa cột Nav) */}
            <div className="flex-shrink-0 w-[220px]">
                <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer select-none group w-fit">
                    <div className="p-1.5 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
                        <svg width="32" height="32" viewBox="50 30 300 300">
                            <path d="M 120 230 L 70 230 L 70 130 L 150 130 L 150 50 L 250 50 L 250 130 L 330 130 L 330 230 L 250 230 L 250 310 L 150 310 L 150 260" fill="none" stroke="#0088ce" strokeWidth="16" />
                            <path d="M 115 238 C 130 140, 190 125, 260 100 C 245 170, 200 215, 150 235 C 185 215, 230 170, 240 125 C 180 140, 130 170, 125 238 Z" fill="#00a68c" />
                        </svg>
                    </div>
                    <h1 className="font-black text-2xl tracking-tighter bg-gradient-to-r from-secondary-color to-primary-color bg-clip-text text-transparent">
                        ClinicBook
                    </h1>
                </div>
            </div>

            {/* CENTER: NAV LINKS (Căn giữa tuyệt đối) */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
                {navLinks.map((link) => (
                    <span
                        key={link.title}
                        onClick={() => navigate(link.path)}
                        className={`relative cursor-pointer text-sm font-bold transition-all duration-300 ${
                            location.pathname === link.path ? "text-primary-color" : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        {link.title}
                        {location.pathname === link.path && (
                            <Box sx={{ position: 'absolute', bottom: -6, left: 0, right: 0, height: '2px', bgcolor: 'primary.main', borderRadius: '2px' }} />
                        )}
                    </span>
                ))}
            </div>

            {/* RIGHT: ACTIONS (Căn lề phải, ẩn hiện theo auth) */}
            <div className="flex items-center justify-end gap-3 flex-shrink-0 min-w-[220px]">

                {/* Chỉ hiện Become Partner khi ĐÃ đăng nhập */}
                {user?.id && (
                    <Button
                        onClick={() => navigate("/become-partner")}
                        variant="contained"
                        sx={{
                            borderRadius: "12px", textTransform: "none", fontWeight: 800, px: 3,
                            boxShadow: 'none', bgcolor: 'primary.main',
                            display: { xs: 'none', sm: 'inline-flex' },
                            '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 8px 16px rgba(0,136,206,0.2)' }
                        }}
                    >
                        Partner With Us
                    </Button>
                )}

                {/* Chỉ hiện Thông báo khi ĐÃ đăng nhập */}
                {user?.id && (
                    <IconButton onClick={() => navigate("/notifications")} sx={{ bgcolor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.2)' }}>
                        <Badge badgeContent={notifications.filter(n => !n.read).length} color="error"
                               sx={{ "& .MuiBadge-badge": { fontSize: 10, minWidth: 16, height: 16 } }}>
                            <NotificationsActiveIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                        </Badge>
                    </IconButton>
                )}

                {user?.id ? (
                    <div className="flex gap-3 items-center border-l pl-4 border-gray-200 ml-1">
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', xl: 'block' } }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
                                {user.fullName?.toUpperCase()}
                            </Typography>
                            <Typography sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary' }}>
                                {user.role === "OWNER" ? "Clinic Owner" : user.role ==='ADMIN' ? 'Admin' :'Member'}
                            </Typography>
                        </Box>

                        <IconButton onClick={handleClick} size="small" sx={{ p: 0.5 }}>
                            <Box sx={{
                                width: 40, height: 40, borderRadius: "10px",
                                background: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 135%)',
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 15, fontWeight: 800, color: "white",
                                border: "2px solid white", boxShadow: 2,
                            }}>

                                {user.fullName?.[0]?.toUpperCase()}
                            </Box>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl} open={open} onClose={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    mt: 1.5, width: 268, borderRadius: "16px",
                                    border: "0.5px solid rgba(0,0,0,0.08)",
                                    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.1))",
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* Header Menu */}
                            <Box sx={{ px: 2, py: 1.75, display: "flex", alignItems: "center", gap: 1.5, background: "linear-gradient(135deg, rgba(0,136,206,0.04), rgba(0,166,140,0.04))" }}>
                                <Box sx={{ width: 42, height: 42, borderRadius: "10px", background: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 135%)', display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white" }}>
                                    {user.fullName?.[0]?.toUpperCase()}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography noWrap sx={{ fontSize: 14, fontWeight: 700 }}>{user.fullName.toUpperCase()}</Typography>
                                    <Typography noWrap sx={{ fontSize: 11, color: "text.secondary" }}>{user.email}</Typography>
                                </Box>
                            </Box>

                            {/* Menu Items */}
                            <Box sx={{ p: "6px" }}>
                                {menuItems.map((item) => (
                                    <MenuItem key={item.path} onClick={handleMenuClick(item.path)} sx={{ borderRadius: "10px", gap: 1.5, py: 1 }}>
                                        <Box sx={{ width: 34, height: 34, borderRadius: "8px", background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {item.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.label}</Typography>
                                            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{item.sub}</Typography>
                                        </Box>
                                        <ChevronRightIcon sx={{ fontSize: 15, color: "text.disabled" }} />
                                    </MenuItem>
                                ))}
                            </Box>

                            <Divider sx={{ mx: 1 }} />

                            <Box sx={{ p: "6px" }}>
                                <MenuItem onClick={handleMenuClick("/logout")} sx={{ borderRadius: "10px", gap: 1.5, py: 1 }}>
                                    <Box sx={{ width: 34, height: 34, borderRadius: "8px", background: "rgba(211,47,47,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Logout sx={{ fontSize: 16, color: "error.main" }} />
                                    </Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "error.main" }}>Sign out</Typography>
                                </MenuItem>
                            </Box>
                        </Menu>
                    </div>
                ) : (
                    /* Hiện nút Sign In khi CHƯA đăng nhập */
                    <Button
                        onClick={() => keycloak.login()}
                        variant="outlined"
                        startIcon={<AccountCircleIcon />}
                        sx={{
                            borderRadius: "12px", textTransform: "none", fontWeight: 700,
                            borderWidth: '2px', px: 3,
                            '&:hover': { borderWidth: '2px' }
                        }}
                    >
                        Sign In
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;