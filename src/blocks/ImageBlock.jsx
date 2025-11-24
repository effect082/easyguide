import React from 'react';

const ImageBlock = ({ content, styles }) => {
    const { src, link } = content;
    const { backgroundColor = 'transparent', padding = '0px', borderRadius = '0px' } = styles || {};

    const ImageComponent = (
        <img
            src={src || 'https://placehold.co/600x400?text=No+Image'}
            alt="Block Content"
            loading="lazy"
            className="w-full h-auto object-cover"
            style={{ borderRadius }}
        />
    );

    return (
        <div style={{ backgroundColor, padding }}>
            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer hover:opacity-90 transition-opacity"
                >
                    {ImageComponent}
                </a>
            ) : (
                ImageComponent
            )}
        </div>
    );
};

export default ImageBlock;
