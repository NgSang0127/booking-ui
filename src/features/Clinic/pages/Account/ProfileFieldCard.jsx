import React from "react";

const ProfileFieldCard = ({ label, value, icon }) => (
    <div className="flex items-start gap-3">
        {icon && (
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {icon}
            </div>
        )}
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-0.5">
                {label}
            </p>
            <p className="text-sm font-medium text-gray-800 truncate">
                {value || <span className="text-gray-300 font-normal">Chưa cập nhật</span>}
            </p>
        </div>
    </div>
);

export default ProfileFieldCard;