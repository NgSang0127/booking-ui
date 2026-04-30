import React from "react";
import { useNavigate } from "react-router-dom";

const HomeServiceCard = ({ item }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/search?category=${item.name}`)}
            className="flex flex-row items-center gap-2.5 px-3 py-2 rounded-full
                       bg-white border border-gray-200 flex-shrink-0
                       hover:border-blue-300 hover:bg-blue-50
                       active:scale-[0.97] transition-all duration-150
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                       group whitespace-nowrap"
        >
            {/* Icon tròn */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0
                            group-hover:scale-105 transition-transform duration-150">
                <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                />
            </div>

            <span className="text-[12px] font-medium text-gray-600
                             group-hover:text-blue-700 transition-colors">
                {item.name}
            </span>
        </button>
    );
};

export default HomeServiceCard;