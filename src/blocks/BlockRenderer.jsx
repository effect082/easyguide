import React from 'react';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import HeadBlock from './HeadBlock';
import SlideBlock from './SlideBlock';
import FormBlock from './FormBlock';
import SocialBlock from './SocialBlock';
import GalleryBlock from './GalleryBlock';
import BusinessBlock from './BusinessBlock';
import ScheduleBlock from './ScheduleBlock';
import MapBlock from './MapBlock';
import ShareBlock from './ShareBlock';
import LinkBlock from './LinkBlock';

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
        case 'gallery':
            return <GalleryBlock content={block.content} styles={block.styles} />;
        case 'business':
            return <BusinessBlock content={block.content} styles={block.styles} />;
        case 'schedule':
            return <ScheduleBlock content={block.content} styles={block.styles} />;
        case 'map':
            return <MapBlock content={block.content} styles={block.styles} />;
        case 'share':
            return <ShareBlock content={block.content} styles={block.styles} />;
        case 'link':
            return <LinkBlock content={block.content} styles={block.styles} />;
        default:
            return <div className="p-4 text-center text-gray-400">Unknown Block Type: {block.type}</div>;
    }
};

export default BlockRenderer;
