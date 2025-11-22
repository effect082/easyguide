import React, { useEffect, useState } from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

const ViewMode = ({ uuid }) => {
    const [blocks, setBlocks] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const viewParam = params.get('view');
            const dataParam = params.get('data');

            if (dataParam) {
                // New format: data parameter contains blocks and metadata
                const decoded = decodeURIComponent(atob(dataParam));
                const publishData = JSON.parse(decoded);

                setBlocks(publishData.blocks || []);
                setMetadata(publishData.metadata);

                // Update document title and meta tags for social sharing
                if (publishData.metadata) {
                    const shareTitle = `${publishData.metadata.type} "${publishData.metadata.title}"`;
                    const shareDescription = publishData.metadata.description || publishData.metadata.title;

                    document.title = shareTitle;

                    // Update or create meta tags
                    const updateMetaTag = (property, content) => {
                        let metaTag = document.querySelector(`meta[property="${property}"]`);
                        if (!metaTag) {
                            metaTag = document.createElement('meta');
                            metaTag.setAttribute('property', property);
                            document.head.appendChild(metaTag);
                        }
                        metaTag.setAttribute('content', content);
                    };

                    const updateNameMetaTag = (name, content) => {
                        let metaTag = document.querySelector(`meta[name="${name}"]`);
                        if (!metaTag) {
                            metaTag = document.createElement('meta');
                            metaTag.setAttribute('name', name);
                            document.head.appendChild(metaTag);
                        }
                        metaTag.setAttribute('content', content);
                    };

                    // Open Graph tags
                    updateMetaTag('og:title', shareTitle);
                    updateMetaTag('og:description', shareDescription);
                    updateMetaTag('og:type', 'article');

                    // KakaoTalk specific tags
                    updateMetaTag('kakao:title', shareTitle);
                    updateMetaTag('kakao:description', shareDescription);

                    // Standard meta description
                    updateNameMetaTag('description', shareDescription);
                }
            } else if (viewParam && viewParam !== 'shared') {
                // Old UUID format - try localStorage (for backwards compatibility)
                const publishedContent = JSON.parse(localStorage.getItem('published_content') || '{}');
                const content = publishedContent[viewParam];

                if (content) {
                    setBlocks(content.blocks || []);
                    setMetadata(content.metadata);
                } else {
                    setError('콘텐츠를 찾을 수 없습니다. URL이 유효하지 않거나 만료되었을 수 있습니다.');
                }
            }
        } catch (err) {
            console.error(err);
            setError('콘텐츠를 불러오는데 실패했습니다. URL이 유효하지 않을 수 있습니다.');
        }
    }, [uuid]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
                {error}
            </div>
        );
    }

    if (blocks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
                콘텐츠를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-[480px] bg-white min-h-screen shadow-lg">
                {blocks.map((block) => (
                    <div key={block.id} className="relative">
                        <BlockRenderer block={block} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewMode;
