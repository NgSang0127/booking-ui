import React, {useState} from 'react'
import AdminDrawerList from '../../components/DrawerList.jsx'
import Navbar from "../../../AdminSeller/components/navbar/Navbar.jsx";
import {Outlet} from "react-router-dom"
import AppSnackbar from "../../../../components/common/AppSnackbar.jsx";


const AdminDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar DrawerList={AdminDrawerList}/>
                <section className="flex" style={{ paddingTop: "56px", height: "100vh" }}>
                    <aside
                        className={`
                        hidden lg:flex flex-col flex-shrink-0 relative
                        border-r border-gray-100 bg-white
                        transition-all duration-300 ease-in-out
                        ${collapsed ? "w-[70px]" : "w-[240px]"}
                    `}
                        style={{ height: "calc(100vh - 56px)", position: "sticky", top: 56 }}
                    >
                        <AdminDrawerList       collapsed={collapsed}
                                               onCollapseToggle={() => setCollapsed((c) => !c)}/>

                    </aside>

                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </section>
                <AppSnackbar/>
            </div>
        </>


    )
}

export default AdminDashboard