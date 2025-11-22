import React from 'react';

const ImageBlock = ({ content, styles }) => {
    return (
        <div style={{ ...styles, padding: '10px' }}>
            {content.src ? (
                <img src={content.src} alt="Block" className="w-full h-auto rounded" />
            ) : (
                <div className="bg-gray-200 h-40 flex items-center justify-center text-gray-500 rounded">
                    No Image Selected
                </div>
            )}
        </div>
    );
};

export default ImageBlock;
