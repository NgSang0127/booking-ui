import {lazy} from 'react';
import ProtectedRoute from './ProtectedRoute.jsx';
import LazyWrapper from '../components/common/LazyWrapper.jsx';
import HomePage from '../features/Clinic/pages/SellerDashboard/HomePage.jsx';
import Services from '../features/Clinic/pages/ClinicService/Services.jsx';
import ServiceForm from '../features/Clinic/pages/ClinicService/AddServiceForm.jsx';
import UpdateServiceForm from '../features/Clinic/pages/ClinicService/UpdateServiceClinicForm.jsx';
import BookingTable from '../features/Clinic/pages/Booking/BookingTable.jsx';
import Profile from '../features/Clinic/pages/Account/Profile.jsx';
import Category from '../features/Clinic/pages/Category/Category.jsx';
import Payment from '../features/Clinic/pages/Payment/Payment.jsx';
import TransactionTable from '../features/Clinic/pages/Payment/TransactionTable.jsx';
import Notification from '../features/Customer/pages/Notification/Notification.jsx';
import UserProfile from '../features/Customer/pages/Profile/UserProfile.jsx';

const ClinicDashboard = lazy(() => import('../features/Clinic/pages/SellerDashboard/ClinicDashboard.jsx'));
const BecomePartner   = lazy(() => import('../features/Clinic/pages/BecomePartner/BecomePartnerForm.jsx'));

const clinicRoutes = {
        element: <ProtectedRoute allowedRoles={['OWNER']} />,
        children: [
                {
                        path: 'become-partner',
                        element: <LazyWrapper><BecomePartner /></LazyWrapper>,
                },
                {
                        path: 'clinic-dashboard',
                        element: <LazyWrapper><ClinicDashboard /></LazyWrapper>,
                        children: [
                                { index: true,            element: <HomePage /> },
                                { path: 'services',       element: <Services /> },
                                { path: 'services/:id',   element: <UpdateServiceForm /> },
                                { path: 'add-services',   element: <ServiceForm /> },
                                { path: 'bookings',       element: <BookingTable /> },
                                { path: 'account',        element: <Profile /> },
                                { path: 'category',       element: <Category /> },
                                { path: 'category/:id',   element: <Category /> },
                                { path: 'payment',        element: <Payment /> },
                                { path: 'transaction',    element: <TransactionTable /> },
                                { path: 'notifications',  element: <Notification /> },
                                { path: 'profile',        element: <UserProfile /> },
                        ],
                },
        ],
};

export default clinicRoutes;