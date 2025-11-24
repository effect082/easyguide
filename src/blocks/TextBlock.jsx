import React from 'react';

const TextBlock = ({ content, styles }) => {
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

    return (
        <div style={{ backgroundColor, padding: '10px' }}>
            <div
                style={{
                    whiteSpace: 'pre-wrap',
                    textAlign,
                    fontSize: getFontSize(fontSize),
                    color,
                    fontWeight
                }}
                dangerouslySetInnerHTML={{ __html: content.text || '<p>Double click to edit text</p>' }}
            />
        </div>
    );
};

export default TextBlock;
