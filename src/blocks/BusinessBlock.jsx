import React from 'react';

const BusinessBlock = ({ content, styles }) => {
    const { name = 'Business Name', description = '', items = [] } = content;
    const {
        backgroundColor = 'transparent',
        // Global defaults (keep for backward compatibility or container)
        textAlign = 'left',
        color = '#000000',
        // Specific styles
        nameHeading = {},
        descriptionText = {}
    } = styles || {};

    const getFontSize = (size) => {
        switch (size) {
            case 'small': return '0.875rem';
            case 'medium': return '1rem';
            case 'large': return '1.25rem';
            case 'xlarge': return '1.5rem';
            default: return '1rem';
        }
    };

    // Name styles (default to bold, larger)
    const nameStyle = {
        textAlign: nameHeading.textAlign || 'left',
        fontSize: getFontSize(nameHeading.fontSize || 'large'),
        fontWeight: nameHeading.fontWeight || 'bold',
        color: nameHeading.color || color,
        marginBottom: '0.5rem'
    };

    // Description styles
    const descStyle = {
        textAlign: descriptionText.textAlign || 'left',
        fontSize: getFontSize(descriptionText.fontSize || 'medium'),
        fontWeight: descriptionText.fontWeight || 'normal',
        color: descriptionText.color || color,
        marginBottom: '1.5rem',
        whiteSpace: 'pre-wrap'
    };

    // Item styles (inherit from description or keep default)
    const itemStyle = {
        fontSize: getFontSize(descriptionText.fontSize || 'medium'),
        color: descriptionText.color || color
    };

    return (
        <div style={{ backgroundColor, padding: '24px' }}>
            <h3 style={nameStyle}>
                {name}
            </h3>
            {description && (
                <p style={descStyle}>
                    {description}
                </p>
            )}

            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3" style={itemStyle}>
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
