import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import keycloak from "../../../../keycloak/keycloak.js";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';


const DrawerList = ({
                        menu = [],
                        menu2 = [],
                        toggleDrawer,
                        collapsed,
                        onCollapseToggle,
                    }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector((state) => state.auth.user);
    const currentClinic = useSelector((state) => state.clinic.currentClinic);

    const handleClick = (item) => {
        if (item.name === "Logout") {
            keycloak.logout();
            return;
        }

        navigate(item.path);
        if (toggleDrawer) toggleDrawer(false)();
    };

    const isActive = (path) => {
        const currentPath = location.pathname.replace(/\/$/, "");
        const targetPath = path.replace(/\/$/, "");

        if (targetPath === "/clinic-dashboard" || targetPath === "/admin") {
            return currentPath === targetPath;
        }

        return location.pathname.startsWith(path);
    };

    const NavItem = ({ item }) => {
        const active = isActive(item.path);
        const isLogout = item.name === "Logout";

        const btn = (
            <button
                onClick={() => handleClick(item)}
                className={`
                    flex items-center h-9 rounded-lg text-left text-sm
                    transition-all duration-150 flex-shrink-0
                    ${collapsed ? "w-9 justify-center mx-auto" : "gap-2.5 px-2.5 mx-2"}
                    ${isLogout
                    ? "text-red-500 hover:bg-red-50"
                    : active
                        ? "bg-primary-color text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }
                `}
                style={collapsed ? {} : { width: "calc(100% - 16px)" }}
            >
                <span className={`flex-shrink-0 flex items-center justify-center [&_svg]:!text-inherit ${
                    isLogout ? "text-red-500" : active ? "text-white" : "text-gray-400"
                }`}>
                    {item.icon}
                </span>

                {!collapsed && <span className="truncate">{item.name}</span>}
            </button>
        );

        return collapsed ? (
            <Tooltip title={item.name} placement="right" arrow>
                {btn}
            </Tooltip>
        ) : btn;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white border-r border-gray-100">

            {!collapsed && (
                <div className="px-2.5 py-4 flex-shrink-0">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-primary-color/10 flex items-center justify-center flex-shrink-0 text-primary-color">
                           <MedicalInformationIcon />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-800 truncate leading-tight">
                                {currentClinic?.name || "Clinic Name"}
                            </div>
                            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                                {user?.role || "Role"}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto pb-4 scrollbar-thin">
                <div className="space-y-1 mt-2">
                    {menu.map((item, idx) => {
                        const prevItem = menu[idx - 1];
                        const showSection = !collapsed && item.section && item.section !== prevItem?.section;

                        return (
                            <React.Fragment key={item.path}>
                                {showSection && (
                                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 px-5 pt-4 pb-1">
                                        {item.section}
                                    </p>
                                )}
                                <NavItem item={item} />
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Menu (Settings, Logout...) */}
            <div className="border-t border-gray-100 p-2 flex-shrink-0">
                {menu2.map((item) => (
                    <NavItem key={item.path} item={item} />
                ))}
            </div>

            {/* Toggle Button */}
            {onCollapseToggle && (
                <div className="absolute -right-3 top-12 z-20">
                    <button
                        onClick={onCollapseToggle}
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary-color hover:border-primary-color transition-all"
                    >
                        {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DrawerList;