import React from 'react';

const HeadBlock = ({ content, styles }) => {
    const { title, description } = content;
    const {
        backgroundColor = 'transparent',
        fontSize = 'medium',
        textAlign = 'center',
        color = '#000000'
    } = styles || {};

    const getFontSize = (size) => {
        switch (size) {
            case 'small': return '1.25rem'; // 20px
            case 'medium': return '1.5rem'; // 24px
            case 'large': return '2rem'; // 32px
            default: return '1.5rem';
        }
    };

    return (
        <div style={{ backgroundColor, padding: '20px' }}>
            <h2 style={{
                fontSize: getFontSize(fontSize),
                textAlign,
                color,
                fontWeight: 'bold',
                marginBottom: description ? '10px' : '0'
            }}>
                {title || 'New Block'}
            </h2>
            {description && (
                <p style={{
                    fontSize: '0.875rem',
                    textAlign,
                    color: '#666666',
                    whiteSpace: 'pre-wrap'
                }}>
                    {description}
                </p>
            )}
        </div>
    );
};

export default HeadBlock;
