import ClinicTable   from '../features/Admin/pages/Clinic/ClinicTable.jsx';
import AdminUserList from '../features/Admin/pages/User/AdminUserList.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminDashboard from "../features/Admin/pages/Dashboard/Dashboard.jsx";
import AdminClinicList from "../features/Admin/pages/Clinic/AdminClinicList.jsx";

const adminRoutes = {

    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
        {
            path: 'admin',
            element: <AdminDashboard />,
            children: [
                {
                    index: true,
                    element: <ClinicTable />
                },
                {
                    path: 'users',
                    element: <AdminUserList />
                },
                {
                    path:'clinics',
                    element: <AdminClinicList/>
                }
            ],
        },
    ],
}

export default adminRoutes;