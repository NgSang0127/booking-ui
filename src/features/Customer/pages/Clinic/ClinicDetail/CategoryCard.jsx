import React from "react";

const CategoryCard = ({ handleSelectCategory, item, selectedCategory }) => {
    const isActive = selectedCategory === item.id;

    return (
        <button
            onClick={() => handleSelectCategory(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-left
                        cursor-pointer transition-all duration-200 group
                        ${isActive
                ? "bg-primary-color text-white shadow-sm"
                : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
            }`}
        >
            <img
                className={`w-9 h-9 rounded-xl object-cover flex-shrink-0 transition-all duration-200
                            ${isActive ? "ring-2 ring-white/40" : "group-hover:scale-105"}`}
                src={item.image}
                alt={item.name}
                onError={(e) => {
                    e.target.src = "https://cdn.pixabay.com/photo/2020/05/21/11/42/hair-clinic-5200393_640.jpg";
                }}
            />
            <span className={`text-[13px] font-medium truncate leading-tight
                              ${isActive ? "text-white" : "text-gray-700"}`}>
                {item.name}
            </span>
        </button>
    );
};

export default CategoryCard;