import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditor } from '../context/EditorContext';
import { Share, ArrowLeft, Save, Copy, Download, X, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storage';
import { compressDataUrl, compressProjectBlocks } from '../utils/imageCompression';

const Header = () => {
    const { state, dispatch } = useEditor();
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState('');
    const [publishedUuid, setPublishedUuid] = useState('');
    const [, setMetadata] = useState({ type: '', title: '', description: '' });

    const handleSave = async () => {
        try {
            // Fetch existing projects to preserve createdAt
            let createdAt = new Date().toISOString();
            try {
                const projects = await storage.getProjects();
                const existing = projects.find(p => p.id === state.projectMeta.id);
                if (existing) {
                    createdAt = existing.createdAt;
                }
            } catch {
                console.warn("Failed to fetch existing projects, using new createdAt");
            }


            // Deep copy and compress blocks
            const blocksToSave = await compressProjectBlocks(state.blocks);


            const project = {
                id: state.projectMeta.id || Date.now().toString(),
                title: state.projectMeta.title,
                category: state.projectMeta.category,
                type: state.projectMeta.type,
                password: state.projectMeta.password,
                author: state.projectMeta.author,
                blocks: blocksToSave,
                createdAt: createdAt,
                updatedAt: new Date().toISOString(),
            };

            // Check payload size
            const payloadSize = JSON.stringify(project).length;
            console.log('Save payload size:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');

            if (payloadSize > 1 * 1024 * 1024) { // 1MB limit
                throw new Error(`프로젝트 용량이 너무 큽니다 (${(payloadSize / 1024 / 1024).toFixed(2)}MB). 1MB를 초과했습니다. 이미지 개수를 줄여주세요.`);
            }

            await storage.saveProject(project);
            alert('프로젝트가 저장되었습니다!');

            // Update the project meta with the saved ID
            if (!state.projectMeta.id) {
                dispatch({
                    type: 'SET_PROJECT_META',
                    payload: { id: project.id }
                });
            }
        } catch (error) {
            console.error('Save failed:', error);
            if (error.message?.includes('timeout') || error.message?.includes('500')) {
                alert('서버 응답 시간이 초과되었습니다. 프로젝트 용량이 너무 클 수 있습니다. 이미지를 줄여주세요.');
            } else {
                alert(error.message || '저장에 실패했습니다.');
            }
        }
    };

    const handlePublish = async () => {
        if (isPublishing) return;

        try {
            setIsPublishing(true);

            // Generate UUID for this publication
            const uuid = uuidv4();

            // Deep copy and compress blocks
            const blocksToPublish = await compressProjectBlocks(state.blocks);


            // Extract metadata from COMPRESSED blocks
            // Find first image from blocks for og:image
            const firstImageBlock = blocksToPublish.find(b => b.type === 'image' && b.content?.src);
            const firstImageUrl = firstImageBlock?.content?.src || '';

            // Find Head block for title and description
            const headBlock = blocksToPublish.find(b => b.type === 'head');

            // Find Share block for override
            const shareBlock = blocksToPublish.find(b => b.type === 'share');

            let publishMetadata;

            // Priority: Share Block > Head Block > Project Meta
            if (shareBlock && shareBlock.content && shareBlock.content.shareTitle) {
                publishMetadata = {
                    type: shareBlock.content.shareType || state.projectMeta.type || '뉴스레터',
                    title: shareBlock.content.shareTitle,
                    description: shareBlock.content.shareDescription || '',
                    image: shareBlock.content.shareImage || firstImageUrl,
                    backgroundColor: state.projectMeta.backgroundColor || '#ffffff',
                };
            } else {
                // Default fallback logic as requested: Head Block Title + Image Block Image
                publishMetadata = {
                    type: state.projectMeta.type || '뉴스레터',
                    title: headBlock?.content?.title || state.projectMeta.title || '제목 없음',
                    description: headBlock?.content?.description || '',
                    image: firstImageUrl,
                    backgroundColor: state.projectMeta.backgroundColor || '#ffffff',
                };
            }

            // Create publish data
            const publishData = {
                id: uuid,
                projectId: state.projectMeta.id,
                blocks: blocksToPublish,
                metadata: publishMetadata,
                publishedAt: new Date().toISOString(),
            };

            // Check payload size
            const payloadSize = JSON.stringify(publishData).length;
            console.log('Publish payload size:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');

            if (payloadSize > 1 * 1024 * 1024) { // 1MB limit
                throw new Error(`프로젝트 용량이 너무 큽니다 (${(payloadSize / 1024 / 1024).toFixed(2)}MB). 1MB를 초과했습니다. 이미지 개수를 줄여주세요.`);
            }

            // Save via storage service (Supabase)
            await storage.publishContent(uuid, publishData);

            // Generate short URL with query parameter routing
            const baseUrl = window.location.origin + window.location.pathname;
            const cleanBaseUrl = baseUrl.split('?')[0].split('#')[0];
            const url = `${cleanBaseUrl}?project=${uuid}`;

            setPublishedUuid(uuid);
            setPublishedUrl(url);
            setMetadata(publishMetadata);
            setShowPublishModal(true);
        } catch (error) {
            console.error('Publish error:', error);
            if (error.message?.includes('timeout') || error.message?.includes('500')) {
                alert('서버 응답 시간이 초과되었습니다. 프로젝트 용량이 너무 클 수 있습니다. 이미지를 줄여주세요.');
            } else {
                alert(error.message || '게시 중 오류가 발생했습니다.');
            }
        } finally {
            setIsPublishing(false);
        }
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(publishedUrl);
        alert('URL이 클립보드에 복사되었습니다!');
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.download = `qr-${publishedUuid}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600">배경색:</label>
                    <input
                        type="color"
                        value={state.projectMeta.backgroundColor || '#ffffff'}
                        onChange={(e) => dispatch({
                            type: 'SET_PROJECT_META',
                            payload: { backgroundColor: e.target.value }
                        })}
                        className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                        title="전체 배경색 선택"
                    />
                </div>
                <h1 className="text-xl font-bold text-gray-800">{state.projectMeta.title}</h1>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                    <Save size={18} />
                    저장
                </button>
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow ${isPublishing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Share size={18} />}
                    {isPublishing ? '게시 중...' : '게시'}
                </button>
            </div>

            {/* Publish Modal - Rendered via Portal */}
            {showPublishModal && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" style={{ zIndex: 100000, position: 'relative' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">게시 완료 (v1.1)</h2>
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center mb-6 p- bg-gray-50 rounded-lg" style={{ zIndex: 100001, position: 'relative', backgroundColor: 'white' }}>
                            <p className="text-sm font-medium text-gray-700 mb-4">QR 코드</p>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={publishedUrl}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <button
                                onClick={handleDownloadQR}
                                className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 font-medium border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center gap-2"
                            >
                                <Download size={16} />
                                QR 코드 다운로드
                            </button>
                        </div>

                        {/* Shortened URL */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">공유 URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={publishedUrl}
                                    readOnly
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                                />
                                <button
                                    onClick={handleCopyUrl}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Copy size={16} />
                                    복사
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">이 URL을 카카오톡이나 소셜 미디어에 공유하세요</p>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </header>
    );
};

export default Header;
