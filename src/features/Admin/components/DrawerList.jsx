import * as React from "react";

import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import DrawerList from "../../AdminSeller/components/drawerlist/DrawerList.jsx";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
const iconActive = "text-white";
const iconDefault = "text-primary-color";

const menu = [
    {
        name: "Dashboard",
        path: "/admin",
        section: "Tổng quan",
        icon: <DashboardIcon className={iconDefault} sx={{fontSize: 18}}/>,
        activeIcon: <DashboardIcon className={iconActive} sx={{fontSize: 18}}/>,
    },
    {
        name: "Manage User",
        path: "/admin/users",
        section: "Quản lý",
        icon: <PeopleAltOutlinedIcon className={iconDefault} sx={{fontSize: 18}}/>,
        activeIcon: <PeopleAltOutlinedIcon className={iconActive} sx={{fontSize: 18}}/>,
    },
    {
        name: "Approval Clinic",
        path: "/admin/clinics",
        section: "Quản lý",
        icon: <ApprovalOutlinedIcon className={iconDefault} sx={{fontSize: 18}}/>,
        activeIcon: <ApprovalOutlinedIcon className={iconActive} sx={{fontSize: 18}}/>,
    },


    // {
    //     name: "Coupons",
    //     path: "/admin/coupon",
    //     icon: <IntegrationInstructionsIcon className="text-primary-color" />,
    //     activeIcon: <IntegrationInstructionsIcon className="text-white" />,
    // },
    // {
    //     name: "Add New Coupon",
    //     path: "/admin/add-coupon",
    //     icon: <AddIcon className="text-primary-color" />,
    //     activeIcon: <AddIcon className="text-white" />,
    // },
    // {
    //     name: "Home Page",
    //     path: "/admin/home-grid",
    //     icon: <HomeIcon className="text-primary-color" />,
    //     activeIcon: <HomeIcon className="text-white" />,
    // },
    // {
    //     name: "Electronics Category",
    //     path: "/admin/electronics-category",
    //     icon: <ElectricBoltIcon className="text-primary-color" />,
    //     activeIcon: <ElectricBoltIcon className="text-white" />,
    // },
    // {
    //     name: "Shop By Category",
    //     path: "/admin/shop-by-category",
    //     icon: <Category className="text-primary-color" />,
    //     activeIcon: <Category className="text-white" />,
    // },
    // {
    //     name: "Deals",
    //     path: "/admin/deals",
    //     icon: <LocalOfferIcon className="text-primary-color" />,
    //     activeIcon: <LocalOfferIcon className="text-white" />,
    // },

];

const menu2 = [

    // {
    //     name: "Account",
    //     path: "/admin",
    //     icon: <AccountBoxIcon className="text-primary-color" />,
    //     activeIcon: <AccountBoxIcon className="text-white" />,
    // },
    {
        name: "Logout",
        path: "/",
        icon: <LogoutIcon sx={{fontSize: 18}}/>,
        activeIcon: <LogoutIcon sx={{fontSize: 18}}/>,
    },

]


const AdminDrawerList = ({toggleDrawer, collapsed, onCollapseToggle}) => {

    return (
        <>
            <DrawerList menu={menu}
                        menu2={menu2}
                        toggleDrawer={toggleDrawer}
                        collapsed={collapsed}
                        onCollapseToggle={onCollapseToggle}/>
        </>
    );
};

export default AdminDrawerList;