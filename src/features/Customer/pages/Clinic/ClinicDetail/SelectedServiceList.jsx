import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const SelectedServiceList = ({ services, handleRemoveService }) => {
    return (
        <div className="space-y-2">
            {services.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between gap-2
                               bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5
                               hover:border-gray-200 transition-colors group"
                >
                    <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                            ₫{item.price?.toLocaleString("vi-VN")}
                        </p>
                    </div>
                    <button
                        onClick={() => handleRemoveService(item.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0
                                   text-gray-300 hover:text-red-500 hover:bg-red-50
                                   transition-all"
                    >
                        <CloseIcon sx={{ fontSize: 14 }} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SelectedServiceList;