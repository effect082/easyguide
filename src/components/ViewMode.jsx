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

                            // Helper to force update meta tags
                            const setMetaTag = (selector, content) => {
                                let element = document.querySelector(selector);
                                if (!element) {
                                    element = document.createElement('meta');
                                    // Parse selector to set attributes (simple mapping for commonly used tags)
                                    if (selector.includes('[property="')) {
                                        const property = selector.match(/property="([^"]+)"/)[1];
                                        element.setAttribute('property', property);
                                    } else if (selector.includes('[name="')) {
                                        const name = selector.match(/name="([^"]+)"/)[1];
                                        element.setAttribute('name', name);
                                    }
                                    document.head.appendChild(element);
                                }
                                element.setAttribute('content', content);
                            };

                            // Update Title
                            document.title = shareTitle;

                            // Standard Meta
                            setMetaTag('meta[name="description"]', shareDescription);

                            // Open Graph
                            setMetaTag('meta[property="og:title"]', shareTitle);
                            setMetaTag('meta[property="og:description"]', shareDescription);
                            setMetaTag('meta[property="og:url"]', currentUrl);
                            if (absoluteImageUrl) {
                                setMetaTag('meta[property="og:image"]', absoluteImageUrl);
                                setMetaTag('meta[property="og:image:width"]', '1200');
                                setMetaTag('meta[property="og:image:height"]', '630');
                            }

                            // Kakao specific
                            setMetaTag('meta[property="kakao:title"]', shareTitle);
                            setMetaTag('meta[property="kakao:description"]', shareDescription);
                            if (absoluteImageUrl) {
                                setMetaTag('meta[property="kakao:image"]', absoluteImageUrl);
                            }

                            // Twitter
                            setMetaTag('meta[name="twitter:card"]', 'summary_large_image');
                            setMetaTag('meta[name="twitter:title"]', shareTitle);
                            setMetaTag('meta[name="twitter:description"]', shareDescription);
                            if (absoluteImageUrl) {
                                setMetaTag('meta[name="twitter:image"]', absoluteImageUrl);
                            }
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
