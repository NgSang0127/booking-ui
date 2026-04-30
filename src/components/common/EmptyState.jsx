import React from 'react';

const EmptyState = ({ icon, title = 'No data yet', description, action }) => (
    <div
        role="status"
        className="flex flex-col items-center justify-center text-center px-6 py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
    >
        {icon && <div className="mb-4 text-gray-400">{icon}</div>}
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        {description && (
            <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export default EmptyState;