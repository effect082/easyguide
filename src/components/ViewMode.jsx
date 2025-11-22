import React, { useEffect, useState } from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

const ViewMode = ({ uuid }) => {
    const [blocks, setBlocks] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            if (uuid) {
                // New format: Load from localStorage using UUID
                const publishedContent = JSON.parse(localStorage.getItem('published_content') || '{}');
                const content = publishedContent[uuid];

                if (content) {
                    setBlocks(content.blocks || []);
                    setMetadata(content.metadata);

                    // Update document title and meta tags for social sharing
                    if (content.metadata) {
                        const shareTitle = `${content.metadata.type}  "${content.metadata.title}"`;
                        const shareDescription = content.metadata.description || content.metadata.title;

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
                } else {
                    setError('콘텐츠를 찾을 수 없습니다. URL이 유효하지 않거나 만료되었을 수 있습니다.');
                }
            } else {
                // Old format: Load from URL data parameter
                const params = new URLSearchParams(window.location.search);
                const data = params.get('data');
                if (data) {
                    const decoded = decodeURIComponent(atob(data));
                    setBlocks(JSON.parse(decoded));
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
