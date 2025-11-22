import React from 'react';

const ScheduleBlock = ({ content, styles }) => {
    const { title = 'Schedule', items = [] } = content;
    const { backgroundColor = 'transparent' } = styles || {};

    return (
        <div style={{ backgroundColor, padding: '24px' }}>
            {title && (
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{title}</h3>
            )}

            {items.length === 0 ? (
                <div className="text-center text-gray-400 py-4">일정을 추가해주세요</div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="w-16 flex-shrink-0 pt-1">
                                <span className="text-sm font-bold text-blue-600 block">{item.time}</span>
                            </div>
                            <div className="flex-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <h4 className="font-medium text-gray-900 mb-1">{item.event}</h4>
                                {item.description && (
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduleBlock;
