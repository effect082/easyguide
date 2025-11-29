import React, { useEffect, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Trash2 } from 'lucide-react';
import { compressImage, formatFileSize } from '../utils/imageCompression';

// Import Editor Components
import TextBlockEditor from './editors/TextBlockEditor';
import HeadBlockEditor from './editors/HeadBlockEditor';
import ImageBlockEditor from './editors/ImageBlockEditor';
import SlideBlockEditor from './editors/SlideBlockEditor';
import FormBlockEditor from './editors/FormBlockEditor';
import SocialBlockEditor from './editors/SocialBlockEditor';
import GalleryBlockEditor from './editors/GalleryBlockEditor';
import BusinessBlockEditor from './editors/BusinessBlockEditor';

// PropertyPanel component - handles block properties and styling (Refactored)

const PropertyPanel = () => {
    const { state, dispatch } = useEditor();
    const selectedBlock = state.blocks.find(b => b.id === state.selectedBlockId);
    const [values, setValues] = useState({});
    const [styles, setStyles] = useState({});

    useEffect(() => {
        if (selectedBlock) {
            setValues(selectedBlock.content || {});
            setStyles(selectedBlock.styles || {});
        }
    }, [selectedBlock]);

    const handleChange = (key, value) => {
        const newValues = { ...values, [key]: value };
        setValues(newValues);
        dispatch({
            type: 'UPDATE_BLOCK',
            payload: {
                id: selectedBlock.id,
                updates: { content: newValues }
            }
        });
    };

    const handleStyleChange = (key, value) => {
        const newStyles = { ...styles, [key]: value };
        setStyles(newStyles);
        dispatch({
            type: 'UPDATE_BLOCK',
            payload: {
                id: selectedBlock.id,
                updates: { styles: newStyles }
            }
        });
    };

    const handleDelete = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            dispatch({ type: 'REMOVE_BLOCK', payload: selectedBlock.id });
        }
    };

    const [, setIsCompressing] = useState(false);

    const handleImageUpload = async (e, key = 'src') => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setIsCompressing(true);

        try {
            const result = await compressImage(file);

            // Log compression results
            console.log(`✅ Image compressed:`, {
                original: formatFileSize(result.originalSize),
                compressed: formatFileSize(result.compressedSize),
                reduction: `${result.reduction}%`,
                dimensions: `${result.width}x${result.height}`
            });

            // Update block with compressed image
            handleChange(key, result.dataUrl);

        } catch (error) {
            console.error('Image compression failed:', error);
            alert('이미지 압축 실패. 다시 시도해주세요.');
        } finally {
            setIsCompressing(false);
        }
    };

    if (!selectedBlock) {
        return (
            <div className="p-4 h-full overflow-y-auto">
                <h2 className="text-lg font-semibold mb-6 border-b pb-2">프로젝트 설정</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">전체 배경 색상</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={state.projectMeta.backgroundColor || '#ffffff'}
                                onChange={(e) => dispatch({
                                    type: 'SET_PROJECT_META',
                                    payload: { backgroundColor: e.target.value }
                                })}
                                className="w-8 h-8 p-0 border rounded cursor-pointer"
                            />
                            <span className="text-xs text-gray-400">
                                {state.projectMeta.backgroundColor || '#ffffff'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트 제목</label>
                        <input
                            type="text"
                            value={state.projectMeta.title || ''}
                            onChange={(e) => dispatch({
                                type: 'SET_PROJECT_META',
                                payload: { title: e.target.value }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-lg font-semibold">{selectedBlock.type} 속성</h2>
                <div className="flex gap-2">
                    <button onClick={handleDelete} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Common Styles */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">블록 배경 색상</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={styles.backgroundColor || '#ffffff'}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                        />
                        <span className="text-xs text-gray-400">{styles.backgroundColor === 'transparent' ? '투명' : styles.backgroundColor}</span>
                    </div>
                </div>

                {/* Render specific editor based on block type */}
                {selectedBlock.type === 'text' && (
                    <TextBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}

                {selectedBlock.type === 'head' && (
                    <HeadBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}

                {selectedBlock.type === 'image' && (
                    <ImageBlockEditor
                        values={values}
                        handleChange={handleChange}
                        handleImageUpload={handleImageUpload}
                    />
                )}

                {selectedBlock.type === 'video' && (
                    <>
                        {values.src && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">영상 미리보기</label>
                                <div className="relative border rounded-lg overflow-hidden bg-black">
                                    <video
                                        src={values.src}
                                        controls
                                        className="w-full h-48 object-contain"
                                    />
                                    <button
                                        onClick={() => handleChange('src', '')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-sm transition-colors z-10"
                                        title="영상 삭제"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">영상 업로드</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleImageUpload(e, 'src')}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">또는 영상 URL 입력</label>
                            <input
                                type="text"
                                value={values.src || ''}
                                onChange={(e) => handleChange('src', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://..."
                            />
                        </div>
                    </>
                )}

                {selectedBlock.type === 'slide' && (
                    <SlideBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}

                {selectedBlock.type === 'form' && (
                    <FormBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}

                {selectedBlock.type === 'social' && (
                    <SocialBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}

                {selectedBlock.type === 'gallery' && (
                    <GalleryBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}

                {selectedBlock.type === 'business' && (
                    <BusinessBlockEditor
                        values={values}
                        styles={styles}
                        handleChange={handleChange}
                        handleStyleChange={handleStyleChange}
                    />
                )}
            </div>
        </div>
    );
};

export default PropertyPanel;
