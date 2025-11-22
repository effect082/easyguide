import React from 'react';

const TextBlock = ({ content, styles }) => {
    return (
        <div style={{ ...styles, padding: '10px' }}>
            <div
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: content.text || '<p>Double click to edit text</p>' }}
            />
        </div>
    );
};

export default TextBlock;
