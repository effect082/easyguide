import React from 'react';

const BusinessBlock = ({ content, styles }) => {
    const { name = 'Business Name', description = '', items = [] } = content;
    const { backgroundColor = 'transparent' } = styles || {};

    return (
        <div style={{ backgroundColor, padding: '24px' }}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
            {description && (
                <p className="text-gray-600 text-sm mb-6 whitespace-pre-wrap">{description}</p>
            )}

            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                            <span className="font-semibold text-gray-800 min-w-[80px]">{item.label}</span>
                            <span className="text-gray-600 flex-1 whitespace-pre-wrap">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusinessBlock;
