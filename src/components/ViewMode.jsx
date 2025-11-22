import React, { useEffect, useState } from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

const ViewMode = ({ uuid }) => {
    const [blocks, setBlocks] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const projectParam = params.get('project');
            const dataParam = params.get('data');

            if (projectParam) {
                // Load from localStorage using project UUID
                const publishedContent = JSON.parse(localStorage.getItem('published_content') || '{}');
                const content = publishedContent[projectParam];

                if (content) {
                    setBlocks(content.blocks || []);
                    setMetadata(content.metadata);

                    // Update document title and meta tags
                    if (content.metadata) {
                        const shareTitle = `${content.metadata.type} "${content.metadata.title}"`;
                        const shareDescription = content.metadata.description || content.metadata.title;

                        document.title = shareTitle;

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

                        updateMetaTag('og:title', shareTitle);
                        updateMetaTag('og:description', shareDescription);
                        updateMetaTag('og:type', 'article');

                        if (content.metadata.image) {
                            updateMetaTag('og:image', content.metadata.image);
                        }

                        updateMetaTag('kakao:title', shareTitle);
                        updateMetaTag('kakao:description', shareDescription);
                        updateNameMetaTag('description', shareDescription);
                    }
                } else {
                    setError('콘텐츠를 찾을 수 없습니다. URL이 유효하지 않거나 만료되었을 수 있습니다.');
                }
            } else if (dataParam) {
                // Old format: data parameter (for backwards compatibility)
                const decoded = decodeURIComponent(atob(dataParam));
                const publishData = JSON.parse(decoded);
                setBlocks(publishData.blocks || []);
                setMetadata(publishData.metadata);
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
