import React from 'react';

const TableSkeleton = ({ rows = 5, columns = 5 }) => (
    <div role="status" aria-live="polite" className="animate-pulse">
        {Array.from({ length: rows }).map((_, r) => (
            <div
                key={r}
                className="grid gap-4 px-4 py-4 border-b border-gray-100"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: columns }).map((__, c) => (
                    <div key={c} className="h-4 bg-gray-200 rounded" />
                ))}
            </div>
        ))}
        <span className="sr-only">Loading…</span>
    </div>
);

export default TableSkeleton;