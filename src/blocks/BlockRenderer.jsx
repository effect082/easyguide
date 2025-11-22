import React from 'react';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import HeadBlock from './HeadBlock';
import SlideBlock from './SlideBlock';
import FormBlock from './FormBlock';
import SocialBlock from './SocialBlock';

const BlockRenderer = ({ block }) => {
    switch (block.type) {
        case 'text':
            return <TextBlock content={block.content} styles={block.styles} />;
        case 'image':
            return <ImageBlock content={block.content} styles={block.styles} />;
        case 'video':
            return <VideoBlock content={block.content} styles={block.styles} />;
        case 'head':
            return <HeadBlock content={block.content} styles={block.styles} />;
        case 'slide':
            return <SlideBlock content={block.content} styles={block.styles} />;
        case 'form':
            return <FormBlock content={block.content} styles={block.styles} />;
        case 'social':
            return <SocialBlock content={block.content} styles={block.styles} />;
        default:
            return <div className="p-4 text-center text-gray-400">Unknown Block Type: {block.type}</div>;
    }
};

export default BlockRenderer;
