import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Container} from "@mui/material";
import ClinicDetail from "./ClinicDetail.jsx";
import ClinicServiceDetails from "./ClinicServiceDetails.jsx";
import CreateReviewForm from "../../Review/CreateReviewForm.jsx";
import Review from "../../Review/Review.jsx";
import {useGetClinicByIdQuery} from "../../../../../redux/Clinic/clinicApi";
import {useGetCategoriesByClinicQuery} from "../../../../../redux/Category/categoryApi";
import LoadingManager from "../../../../Loading/LoaderManager.jsx";

const tabs = [
    { name: "All Services", label: "Dịch vụ & Đặt lịch", icon: "ri- customer-service-2-line" },
    { name: "Reviews", label: "Đánh giá khách hàng", icon: "ri-star-line" },
    { name: "Create Review", label: "Viết đánh giá", icon: "ri-edit-line" },
];

const ClinicDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const { isLoading: isLoadingClinic } = useGetClinicByIdQuery(id, { skip: !id });
    const { isLoading: isLoadingCategories } = useGetCategoriesByClinicQuery(id, { skip: !id });

    const isLoading = isLoadingClinic || isLoadingCategories;

    if (isLoading) {
        return (
            <LoadingManager fullScreen={false}/>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            {/* Header Section */}
            <Container maxWidth="lg" sx={{ pt: 6, pb: 4 }}>
                <ClinicDetail />
            </Container>

            {/* Sticky Navigation Bar */}
            <div className="sticky top-[75px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <Container maxWidth="lg">
                    <div className="flex overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const isActive = tab.name === activeTab?.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all relative
                                        ${isActive
                                        ? "text-primary-color"
                                        : "text-gray-400 hover:text-gray-700"
                                    }
                                    `}
                                >
                                    <i className={`${tab.icon} text-lg`}></i>
                                    {tab.label}

                                    {/* Active Indicator Line */}
                                    {isActive && (
                                        <Box
                                            component="span"
                                            sx={{
                                                position: 'absolute', bottom: 0, left: 24, right: 24,
                                                h: '3px', bgcolor: 'primary.main', borderRadius: '3px 3px 0 0'
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Container>
            </div>

            {/* Main Content Area */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <div className="animate-slide-up transition-all duration-500">
                    {activeTab?.name === "Create Review" ? (
                        <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                            <CreateReviewForm onSuccess={() => setActiveTab(tabs[1])} />
                        </Box>
                    ) : activeTab?.name === "Reviews" ? (
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <Review />
                        </div>
                    ) : (
                        <ClinicServiceDetails />
                    )}
                </div>
            </Container>

            {/* Footer Spacer */}
            <Box sx={{ height: 100 }} />
        </div>
    );
};

export default ClinicDetails;