import React, { useEffect, useState } from 'react';
import BlockRenderer from '../blocks/BlockRenderer';
import { storage } from '../services/storage';

const ViewMode = ({ uuid }) => {
    const [blocks, setBlocks] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setIsLoading(true);
                const searchParams = new URLSearchParams(window.location.search);
                const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');

                // Prioritize query parameters over hash parameters for SNS crawler compatibility
                const projectParam = searchParams.get('project') || hashParams.get('project');
                const dataParam = searchParams.get('data') || hashParams.get('data');

                if (projectParam) {
                    // Load from storage service using project UUID
                    const content = await storage.getPublishedContent(projectParam);

                    if (content) {
                        setBlocks(content.blocks || []);
                        setMetadata(content.metadata);

                        // Update document title and meta tags
                        if (content.metadata) {
                            const shareTitle = `${content.metadata.type} "${content.metadata.title}"`;
                            const shareDescription = content.metadata.description || content.metadata.title;
                            const currentUrl = window.location.href.split('#')[0]; // Remove hash for clean URL

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

                            // Convert relative image URLs to absolute URLs
                            const getAbsoluteImageUrl = (imageUrl) => {
                                if (!imageUrl) return '';
                                if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                                    return imageUrl;
                                }
                                // For relative URLs, convert to absolute
                                const baseUrl = window.location.origin;
                                return imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
                            };

                            const absoluteImageUrl = getAbsoluteImageUrl(content.metadata.image);

                            // Open Graph (Facebook, KakaoTalk)
                            updateMetaTag('og:title', shareTitle);
                            updateMetaTag('og:description', shareDescription);
                            updateMetaTag('og:type', 'article');
                            updateMetaTag('og:url', currentUrl);
                            updateMetaTag('og:site_name', '강동어울림복지관');

                            if (absoluteImageUrl) {
                                updateMetaTag('og:image', absoluteImageUrl);
                                updateMetaTag('og:image:width', '1200');
                                updateMetaTag('og:image:height', '630');
                                updateMetaTag('og:image:alt', shareTitle);
                            }

                            // KakaoTalk specific
                            updateMetaTag('kakao:title', shareTitle);
                            updateMetaTag('kakao:description', shareDescription);
                            if (absoluteImageUrl) {
                                updateMetaTag('kakao:image', absoluteImageUrl);
                            }

                            // Twitter Card
                            updateNameMetaTag('twitter:card', 'summary_large_image');
                            updateNameMetaTag('twitter:title', shareTitle);
                            updateNameMetaTag('twitter:description', shareDescription);
                            if (absoluteImageUrl) {
                                updateNameMetaTag('twitter:image', absoluteImageUrl);
                            }

                            // Standard meta
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
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [uuid]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
                {error}
            </div>
        );
    }

    if (isLoading || blocks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
                콘텐츠를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center sm:py-12 transition-colors duration-300">
            <div
                className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[800px] sm:h-auto shadow-none sm:shadow-2xl sm:rounded-[40px] overflow-hidden transition-all duration-300 relative"
                style={{ backgroundColor: metadata?.backgroundColor || '#ffffff' }}
            >
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
