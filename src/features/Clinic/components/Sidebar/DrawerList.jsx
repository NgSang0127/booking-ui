import * as React from "react";
import { AccountBox, NotificationsNoneOutlined } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DrawerList from "../../../AdminSeller/components/drawerlist/DrawerList.jsx";

const iconActive = "text-white";
const iconDefault = "text-primary-color";

const menu = [
    {
        name: "Dashboard",
        path: "/clinic-dashboard",
        section: "Tổng quan",
        icon: <DashboardIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <DashboardIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Bookings",
        path: "/clinic-dashboard/bookings",
        section: "Tổng quan",
        icon: <ShoppingBagIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <ShoppingBagIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Services",
        path: "/clinic-dashboard/services",
        section: "Dịch vụ",
        icon: <InventoryIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <InventoryIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Add Service",
        path: "/clinic-dashboard/add-services",
        section: "Dịch vụ",
        icon: <AddIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <AddIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Category",
        path: "/clinic-dashboard/category",
        section: "Dịch vụ",
        icon: <CategoryIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <CategoryIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Payment",
        path: "/clinic-dashboard/payment",
        section: "Tài chính",
        icon: <AccountBalanceWalletIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <AccountBalanceWalletIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Transaction",
        path: "/clinic-dashboard/transaction",
        section: "Tài chính",
        icon: <ReceiptIcon className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <ReceiptIcon className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Notifications",
        path: "/clinic-dashboard/notifications",
        section: "Khác",
        icon: <NotificationsNoneOutlined className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <NotificationsNoneOutlined className={iconActive} sx={{ fontSize: 18 }} />,
    },
];

const menu2 = [
    {
        name: "Account",
        path: "/clinic-dashboard/account",
        icon: <AccountBox className={iconDefault} sx={{ fontSize: 18 }} />,
        activeIcon: <AccountBox className={iconActive} sx={{ fontSize: 18 }} />,
    },
    {
        name: "Logout",
        path: "/",
        icon: <LogoutIcon sx={{ fontSize: 18 }} />,
        activeIcon: <LogoutIcon sx={{ fontSize: 18 }} />,
    },
];

const ClinicDrawerList = ({ toggleDrawer, collapsed, onCollapseToggle }) => (
    <DrawerList
        menu={menu}
        menu2={menu2}
        toggleDrawer={toggleDrawer}
        collapsed={collapsed}
        onCollapseToggle={onCollapseToggle}
    />
);

export default ClinicDrawerList;