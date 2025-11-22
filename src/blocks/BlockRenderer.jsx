import React from 'react';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';

const BlockRenderer = ({ block }) => {
    const { type, content, styles } = block;

    switch (type) {
        case 'text':
            return <TextBlock content={content} styles={styles} />;
        case 'image':
            return <ImageBlock content={content} styles={styles} />;
        case 'video':
            return <VideoBlock content={content} styles={styles} />;
        default:
            return <div className="p-4 text-red-500">Unknown block type: {type}</div>;
    }
};

export default BlockRenderer;
