import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Share, ArrowLeft, Save, Copy, Download, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

const Header = () => {
    const { state, dispatch } = useEditor();
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState('');
    const [publishedUuid, setPublishedUuid] = useState('');
    const [metadata, setMetadata] = useState({ type: '', title: '', description: '' });

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('my_projects') || '[]');
        const existingIndex = saved.findIndex(p => p.id === state.projectMeta.id);

        const project = {
            id: state.projectMeta.id || Date.now().toString(),
            title: state.projectMeta.title,
            category: state.projectMeta.category,
            type: state.projectMeta.type,
            password: state.projectMeta.password,
            author: state.projectMeta.author,
            blocks: state.blocks,
            createdAt: existingIndex >= 0 ? saved[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
            saved[existingIndex] = project;
        } else {
            saved.push(project);
        }

        localStorage.setItem('my_projects', JSON.stringify(saved));
        alert('프로젝트가 저장되었습니다!');

        // Update the project meta with the saved ID
        if (!state.projectMeta.id) {
            dispatch({
                type: 'SET_PROJECT_META',
                payload: { id: project.id }
            });
        }
    };

    const handlePublish = () => {
        try {
            // Prioritize Share block metadata, fall back to Head block
            const shareBlock = state.blocks.find(b => b.type === 'share');
            const headBlock = state.blocks.find(b => b.type === 'head');

            let publishMetadata;

            if (shareBlock && shareBlock.content && shareBlock.content.shareTitle) {
                publishMetadata = {
                    type: shareBlock.content.shareType || state.projectMeta.type || '뉴스레터',
                    title: shareBlock.content.shareTitle,
                    description: shareBlock.content.shareDescription || '',
                    image: shareBlock.content.shareImage || '',
                };
            } else if (headBlock && headBlock.content) {
                publishMetadata = {
                    type: state.projectMeta.type || '뉴스레터',
                    title: headBlock.content.title || state.projectMeta.title || '제목 없음',
                    description: headBlock.content.description || '',
                    image: '',
                };
            } else {
                publishMetadata = {
                    type: state.projectMeta.type || '뉴스레터',
                    title: state.projectMeta.title || '제목 없음',
                    description: '',
                    image: '',
                };
            }

            // Generate UUID for this publication
            const uuid = uuidv4();

            // Create publish data
            const publishData = {
                id: uuid,
                projectId: state.projectMeta.id,
                blocks: state.blocks,
                metadata: publishMetadata,
                publishedAt: new Date().toISOString(),
            };

            // Save to localStorage
            const publishedContent = JSON.parse(localStorage.getItem('published_content') || '{}');
            publishedContent[uuid] = publishData;
            localStorage.setItem('published_content', JSON.stringify(publishedContent));

            // Generate short URL
            const baseUrl = window.location.origin + window.location.pathname;
            const url = `${baseUrl}?project=${uuid}`;

            setPublishedUuid(uuid);
            setPublishedUrl(url);
            setMetadata(publishMetadata);
            setShowPublishModal(true);
        } catch (error) {
            console.error('Publish error:', error);
            alert('게시 중 오류가 발생했습니다.');
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                >
                    <Share size={18} />
                    게시
                </button>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">게시 완료</h2>
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">소셜 공유 정보</p>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-white rounded text-sm font-medium text-gray-700">
                                    {metadata.type}
                                </span>
                                <span className="text-gray-600 text-sm">"{metadata.title}"</span>
                            </div>
                            {metadata.description && (
                                <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{metadata.description}</p>
                            )}
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center mb-6 p- bg-gray-50 rounded-lg">
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
                </div>
            )}
        </header>
    );
};

export default Header;
