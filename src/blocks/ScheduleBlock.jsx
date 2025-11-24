import React from 'react';

const ScheduleBlock = ({ content, styles }) => {
    const { title = 'Schedule', items = [] } = content;
    const {
        backgroundColor = 'transparent',
        textAlign = 'left',
        fontSize = 'medium',
        color = '#000000',
        fontWeight = 'normal'
    } = styles || {};

    const getFontSize = (size) => {
        switch (size) {
            case 'small': return '0.875rem';
            case 'medium': return '1rem';
            case 'large': return '1.25rem';
            default: return '1rem';
        }
    };

    const baseFontSize = getFontSize(fontSize);

    // Format datetime-local to readable Korean format (without seconds)
    const formatDateTime = (datetimeStr) => {
        if (!datetimeStr) return '';
        const date = new Date(datetimeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? '오후' : '오전';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

        return `${year}. ${month}. ${day}. ${period} ${displayHours}:${minutes}`;
    };

    return (
        <div style={{ backgroundColor, padding: '24px', textAlign, color }}>
            {title && (
                <h3
                    className="font-bold mb-4 pb-2 border-b border-gray-200"
                    style={{ fontSize: `calc(${baseFontSize} * 1.25)` }}
                >
                    {title}
                </h3>
            )}

            {items.length === 0 ? (
                <div className="text-center text-gray-400 py-4">일정을 추가해주세요</div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0" style={{ fontSize: baseFontSize, fontWeight }}>
                            {(item.startTime || item.endTime) && (
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {item.startTime && formatDateTime(item.startTime)}
                                        {item.startTime && item.endTime && ' ~ '}
                                        {item.endTime && formatDateTime(item.endTime)}
                                    </span>
                                </div>
                            )}
                            {item.location && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{item.location}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduleBlock;
