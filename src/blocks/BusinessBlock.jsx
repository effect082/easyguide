import React from 'react';

const BusinessBlock = ({ content, styles }) => {
    const { name = 'Business Name', description = '', items = [] } = content;
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

    return (
        <div style={{ backgroundColor, padding: '24px', textAlign, color }}>
            <h3
                className="font-bold mb-2"
                style={{ fontSize: `calc(${baseFontSize} * 1.25)` }}
            >
                {name}
            </h3>
            {description && (
                <p
                    className="mb-6 whitespace-pre-wrap"
                    style={{ fontSize: baseFontSize, fontWeight }}
                >
                    {description}
                </p>
            )}

            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3" style={{ fontSize: baseFontSize, fontWeight }}>
                            <span className="font-semibold min-w-[80px]">{item.label}</span>
                            <span className="flex-1 whitespace-pre-wrap">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusinessBlock;
