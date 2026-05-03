import React, { useState } from "react";
import { useSelector } from "react-redux";
import CategoryTable from "./CategoryTable.jsx";
import CategoryForm from "./CategoryForm.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import { useGetCategoriesByClinicQuery } from "../../../../redux/Category/categoryApi";

const Category = () => {
    const [activeTab, setActiveTab] = useState(1);
    const currentClinic = useSelector((s) => s.clinic.currentClinic);

    const { data: categories, isLoading } = useGetCategoriesByClinicQuery(currentClinic?.id, {
        skip: !currentClinic?.id,
    });

    const tabs = [
        { id: 1, label: "Tất cả danh mục", icon: <ViewListOutlinedIcon sx={{ fontSize: 16 }} /> },
        { id: 2, label: "Thêm mới",         icon: <AddOutlinedIcon      sx={{ fontSize: 16 }} /> },
    ];

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Danh mục dịch vụ</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Quản lý các nhóm dịch vụ của{" "}
                        <span className="font-medium text-gray-600">{currentClinic?.name}</span>
                    </p>
                </div>

                {/* Tab switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-fit">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                                        transition-all duration-150
                                        ${activeTab === t.id
                                ? "bg-white text-primary-color shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-gray-100" />

            {/* ── Content ── */}
            <div className="transition-all duration-200">
                {activeTab === 1 ? (
                    <CategoryTable
                        categories={categories}
                        isLoading={isLoading}
                        onAddNew={() => setActiveTab(2)}
                    />
                ) : (
                    <div className="max-w-lg">
                        <CategoryForm onSuccess={() => setActiveTab(1)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;