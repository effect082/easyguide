import React from 'react';

const GalleryBlock = ({ content, styles }) => {
    const { images = [] } = content;
    const { backgroundColor = 'transparent', columns = 2, gap = 10 } = styles || {};

    if (!images.length) {
        return (
            <div className="p-8 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                이미지를 추가해주세요
            </div>
        );
    }

    return (
        <div style={{ backgroundColor, padding: '20px' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: `${gap}px`
                }}
            >
                {images.map((src, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={src}
                            alt={`Gallery ${index + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryBlock;
