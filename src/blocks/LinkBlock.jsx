import React, { useState } from 'react';

const LinkBlock = ({ content, styles, mode }) => {
    const { title = 'Link Button', url = '#' } = content;
    const {
        backgroundColor = '#ffffff',
        hoverBackgroundColor = null,
        color = '#000000',
        fontSize = 'medium',
        // textAlign = 'center',
        fontWeight = 'normal',
        borderRadius = '16px',
        paddingVertical = '12px',
        paddingHorizontal = '16px'
    } = styles || {};

    const [isHovered, setIsHovered] = useState(false);

    const getFontSize = (size) => {
        switch (size) {
            case 'small': return '0.875rem';
            case 'medium': return '1rem';
            case 'large': return '1.125rem';
            default: return '1rem';
        }
    };

    // Use custom hover color if provided, otherwise auto-calculate
    const getHoverBackgroundColor = (bgColor) => {
        if (hoverBackgroundColor) {
            return hoverBackgroundColor;
        }

        // Auto-calculate: darken for light colors, lighten for dark colors
        if (bgColor.startsWith('#')) {
            const hex = bgColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);

            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const factor = brightness > 128 ? 0.9 : 1.1;

            const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
            const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
            const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));

            return `rgb(${newR}, ${newG}, ${newB})`;
        }
        return bgColor;
    };

    return (
        <div style={{ padding: '8px 20px', marginBottom: '8px' }}>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (mode === 'edit') {
                        e.preventDefault();
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: `${paddingVertical} ${paddingHorizontal}`,
                    backgroundColor: isHovered ? getHoverBackgroundColor(backgroundColor) : backgroundColor,
                    color: color,
                    textDecoration: 'none',
                    borderRadius: borderRadius,
                    fontSize: getFontSize(fontSize),
                    fontWeight: fontWeight,
                    textAlign: 'center',
                    boxShadow: isHovered
                        ? '0 8px 16px rgba(0,0,0,0.15)'
                        : '0 2px 6px rgba(0,0,0,0.08)',
                    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: 'none'
                }}
            >
                {title}
            </a>
        </div>
    );
};

export default LinkBlock;
