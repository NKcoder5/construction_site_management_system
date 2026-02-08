import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
    const variants = {
        'NORMAL': 'bg-blue-50 text-blue-600 border border-blue-200',
        'IMPORTANT': 'bg-orange-50 text-orange-600 border border-orange-200',
        'HIGH': 'bg-red-50 text-red-600 border border-red-200',
        'PENDING': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        'UTILIZED': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        'DONE': 'bg-green-50 text-green-600 border border-green-200',
        'WORKING': 'bg-blue-50 text-blue-600 border border-blue-200',
        'FUTURE': 'bg-purple-50 text-purple-600 border border-purple-200',
        'OFFLINE': 'bg-orange-50 text-orange-600 border border-orange-200',
        'ONLINE': 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    };

    return (
        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${variants[status] || variants['NORMAL']} ${className}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
