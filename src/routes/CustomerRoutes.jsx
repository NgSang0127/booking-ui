import Navbar from '../features/Customer/pages/Navbar/Navbar';
import Footer from '../features/Customer/pages/Footer/Footer';
import {Outlet} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import Home from '../features/Customer/pages/Home/Home';
import ClinicDetails from '../features/Customer/pages/Clinic/ClinicDetail/ClinicDetails.jsx';
import SearchClinic from '../features/Customer/pages/Clinic/SearchClinic.jsx';
import AboutPage from '../features/Customer/pages/About/AboutPage.jsx';
import ContactPage from '../features/Customer/pages/Contact/ContactPage.jsx';
import PaymentSuccessHandler from '../features/Customer/pages/Payment/PaymentSuccessHandler.jsx';
import PaymentCancel from '../features/Customer/pages/Payment/PaymentCancel.jsx';
import Bookings from '../features/Customer/pages/Booking/Bookings.jsx';
import Notification from '../features/Customer/pages/Notification/Notification.jsx';
import UserProfile from '../features/Customer/pages/Profile/UserProfile.jsx';
import PendingApproval from "../features/Admin/pages/Clinic/PendingApprove.jsx";

// eslint-disable-next-line react-refresh/only-export-components
function CustomerLayout() {
    return (
        <>
            <Navbar/>
            <div className="pb-20 min-h-[90vh] mt-[5rem]">
                <Outlet/>
            </div>
            <Footer/>
        </>
    );
}

const customerRoutes = {
    element: <CustomerLayout/>,
    children: [
        {index: true, element: <Home/>},
        {path: 'clinic/:id', element: <ClinicDetails/>},
        {path: 'search', element: <SearchClinic/>},
        {path: 'about', element: <AboutPage/>},
        {path: 'contact', element: <ContactPage/>},
        {path: 'payment-success/:id', element: <PaymentSuccessHandler/>},
        {path: 'payment/cancel', element: <PaymentCancel/>},
        {path: 'become-partner/pending', element: <PendingApproval/>},

        {
            element: <ProtectedRoute allowedRoles={['CUSTOMER', 'OWNER', 'ADMIN']}/>,
            children: [
                {path: 'bookings', element: <Bookings/>},
                {path: 'profile', element: <UserProfile/>},
                {path: 'notifications', element: <Notification type="USER"/>},
            ],
        },
    ],
};

export default customerRoutes;