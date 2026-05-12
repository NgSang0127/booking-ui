import React from "react";
import {Badge, Drawer, IconButton, Tooltip} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {NotificationsActive, LocalHospital} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useGetNotificationsByClinicQuery} from "../../../../redux/Dashboard/dashboardApi";
import useNotificationWebsoket from "../../../../util/useNotificationWebsocket.jsx";

const Navbar = ({DrawerList}) => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);


    const currentClinic = useSelector((state) => state.clinic.currentClinic);
    const user = useSelector((state) => state.auth.user);


    const {data: notifications} = useGetNotificationsByClinicQuery(currentClinic?.id, {
        skip: !currentClinic?.id,
    });

    const toggleDrawer = (newOpen) => () => setOpen(newOpen);


    useNotificationWebsoket(currentClinic?.id, "clinic");

    const userInitials = user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "CB";

    return (
        <header className="h-14 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-white border-b border-gray-100">

            {/* Left — Menu + Logo */}
            <div className="flex items-center gap-2">
                <IconButton
                    onClick={toggleDrawer(true)}
                    size="small"
                    sx={{
                        display: {xs: "inline-flex", lg: "none"},
                        width: 34, height: 34,
                        borderRadius: "8px",
                    }}
                >
                    <MenuIcon sx={{fontSize: 20}}/>
                </IconButton>

                <button onClick={() => navigate("/")} className="flex items-center gap-2 group cy">
                    <div
                        className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <LocalHospital sx={{fontSize: 18, color: "primary.main"}}/>
                    </div>
                    <div className="text-left hidden sm:block">
                        <div
                            className="text-sm font-bold text-gray-800 leading-tight group-hover:text-primary-color transition-colors cursor-pointer">
                            ClinicBook
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">Dashboard</div>
                    </div>
                </button>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-1.5">
                <Tooltip title="Tìm kiếm">
                    <IconButton size="small" sx={{width: 34, height: 34, borderRadius: "8px"}}>
                        <SearchIcon sx={{fontSize: 18}}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Thông báo">
                    <IconButton
                        onClick={() => navigate("/clinic-dashboard/notifications")}
                        size="small"
                        sx={{width: 34, height: 34, borderRadius: "8px"}}
                    >
                        <Badge
                            // 4. notifications bây giờ là data trực tiếp từ API
                            badgeContent={notifications?.length || 0}
                            color="error"
                            overlap="circular"
                            sx={{"& .MuiBadge-badge": {fontSize: 9, minWidth: 14, height: 14}}}
                        >
                            <NotificationsActive sx={{fontSize: 18}}/>
                        </Badge>
                    </IconButton>
                </Tooltip>

                <div className="w-px h-4 bg-gray-200 mx-1"/>

                {/* Avatar động theo User Profile */}
                <Tooltip title="Tài khoản">
                    <button
                        onClick={() => {
                            if (user.role === 'OWNER') {
                                navigate("/clinic-dashboard/account");
                            } else if (user.role === 'ADMIN') {
                                navigate("/admin/account");
                            }
                        }}
                        className="w-8 h-8 rounded-full bg-primary-color text-white border border-transparent flex items-center justify-center text-[11px] font-bold hover:shadow-md transition-all flex-shrink-0"
                    >
                        {userInitials}
                    </button>
                </Tooltip>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{sx: {width: 260, border: "none"}}}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <LocalHospital sx={{fontSize: 18, color: "primary.main"}}/>
                        </div>
                        <div className="text-sm font-bold text-gray-800">ClinicBook</div>
                    </div>
                    <IconButton size="small" onClick={toggleDrawer(false)}>
                        <CloseIcon sx={{fontSize: 18}}/>
                    </IconButton>
                </div>

                {DrawerList && <DrawerList toggleDrawer={toggleDrawer}/>}
            </Drawer>
        </header>
    );
};

export default Navbar;