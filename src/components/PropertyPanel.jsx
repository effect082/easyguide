import React, { useEffect, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { compressImage, formatFileSize } from '../utils/imageCompression';

// PropertyPanel component - handles block properties and styling (Updated)

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

    const handleMove = (direction) => {
        const index = state.blocks.findIndex(b => b.id === selectedBlock.id);
        if (index === -1) return;

        const newBlocks = [...state.blocks];
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        }
        dispatch({ type: 'REORDER_BLOCKS', payload: newBlocks });
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

    const BLOCK_NAMES = {
        head: '헤드(제목)',
        text: '텍스트',
        image: '이미지',
        video: '영상',
        slide: '슬라이드',
        form: '입력 폼',
        social: '소셜 링크',
        gallery: '갤러리',
        business: '사업안내',
        schedule: '일정',
        map: '지도',
        share: '공유 정보',
        link: '링크 버튼'
    };

    return (
        <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-lg font-semibold">{BLOCK_NAMES[selectedBlock.type] || selectedBlock.type} 속성</h2>
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

                {/* Text Block */}
                {selectedBlock.type === 'text' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">텍스트 내용 (HTML)</label>
                        <textarea
                            value={values.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md h-32 text-sm font-mono mb-4"
                        />

                        <div className="space-y-4 border-t pt-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">텍스트 스타일</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">정렬</label>
                                    <select
                                        value={styles.textAlign || 'left'}
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="center">중앙</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">크기</label>
                                    <select
                                        value={styles.fontSize || 'medium'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="small">작게</option>
                                        <option value="medium">보통</option>
                                        <option value="large">크게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">굵기</label>
                                    <select
                                        value={styles.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="normal">보통</option>
                                        <option value="bold">굵게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Head Block */}
                {selectedBlock.type === 'head' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <input
                                type="text"
                                value={values.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                            <textarea
                                value={values.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm h-20"
                            />
                        </div>
                        <div className="space-y-4 border-t pt-4 my-4">
                            {/* Force update for Head block properties */}
                            <h4 className="text-xs font-bold text-gray-500 uppercase">텍스트 스타일</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">정렬</label>
                                    <select
                                        value={styles.textAlign || 'center'}
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="center">중앙</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">크기</label>
                                    <select
                                        value={styles.fontSize || 'medium'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="small">작게</option>
                                        <option value="medium">보통</option>
                                        <option value="large">크게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">굵기</label>
                                    <select
                                        value={styles.fontWeight || 'bold'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="normal">보통</option>
                                        <option value="bold">굵게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Image Block */}
                {selectedBlock.type === 'image' && (
                    <>
                        {values.src && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">이미지 미리보기</label>
                                <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                                    <img
                                        src={values.src}
                                        alt="Preview"
                                        className="w-full h-48 object-contain"
                                    />
                                    <button
                                        onClick={() => handleChange('src', '')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-sm transition-colors"
                                        title="이미지 삭제"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이미지 업로드</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'src')}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">또는 이미지 URL 입력</label>
                            <input
                                type="text"
                                value={values.src || ''}
                                onChange={(e) => handleChange('src', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL (선택사항)</label>
                            <input
                                type="text"
                                value={values.link || ''}
                                onChange={(e) => handleChange('link', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-400 mt-1">이미지를 클릭했을 때 이동할 URL을 입력하세요</p>
                        </div>
                    </>
                )}

                {/* Video Block */}
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

                {/* Slide Block */}
                {selectedBlock.type === 'slide' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">슬라이드 전환 간격 (초)</label>
                            <input
                                type="number"
                                value={styles.interval || 3}
                                onChange={(e) => handleStyleChange('interval', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                min="1"
                            />
                        </div>
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">슬라이드 이미지 관리</label>
                                <div className="mb-3">
                                    <label className="block text-xs text-gray-500 mb-1">이미지 업로드</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    handleChange('images', [...(values.images || []), reader.result]);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <div className="space-y-3">
                                    {(values.images || []).map((img, idx) => (
                                        <div key={idx} className="border rounded-lg p-2 bg-gray-50">
                                            <div className="relative mb-2 bg-white rounded border overflow-hidden h-32 flex items-center justify-center">
                                                {img ? (
                                                    <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-gray-400 text-xs">이미지 없음</span>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const newImages = values.images.filter((_, i) => i !== idx);
                                                        handleChange('images', newImages);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-sm transition-colors"
                                                    title="삭제"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={img}
                                                onChange={(e) => {
                                                    const newImages = [...(values.images || [])];
                                                    newImages[idx] = e.target.value;
                                                    handleChange('images', newImages);
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="이미지 URL"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleChange('images', [...(values.images || []), ''])}
                                    className="w-full py-2 mt-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                                >
                                    + URL로 이미지 추가
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Form Block */}
                {selectedBlock.type === 'form' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">폼 제목</label>
                            <input
                                type="text"
                                value={values.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">버튼 텍스트</label>
                            <input
                                type="text"
                                value={values.buttonText || '제출'}
                                onChange={(e) => handleChange('buttonText', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>

                        <div className="space-y-4 border-t pt-4 my-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">텍스트 스타일</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">정렬</label>
                                    <select
                                        value={styles.textAlign || 'left'}
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="center">중앙</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">크기</label>
                                    <select
                                        value={styles.fontSize || 'medium'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="small">작게</option>
                                        <option value="medium">보통</option>
                                        <option value="large">크게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">굵기</label>
                                    <select
                                        value={styles.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="normal">보통</option>
                                        <option value="bold">굵게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">입력 필드</label>
                            {(values.fields || []).map((field, idx) => (
                                <div key={idx} className="mb-2 p-2 border border-gray-100 rounded bg-gray-50">
                                    <div className="flex gap-2 mb-1">
                                        <input
                                            type="text"
                                            placeholder="라벨 (예: 이름)"
                                            value={field.label || ''}
                                            onChange={(e) => {
                                                const newFields = [...(values.fields || [])];
                                                newFields[idx] = { ...field, label: e.target.value };
                                                handleChange('fields', newFields);
                                            }}
                                            className="w-1/3 p-1 border border-gray-300 rounded text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => {
                                                const newFields = values.fields.filter((_, i) => i !== idx);
                                                handleChange('fields', newFields);
                                            }}
                                            className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="플레이스홀더 (예: 이름을 입력하세요)"
                                        value={field.placeholder || ''}
                                        onChange={(e) => {
                                            const newFields = [...(values.fields || [])];
                                            newFields[idx] = { ...field, placeholder: e.target.value };
                                            handleChange('fields', newFields);
                                        }}
                                        className="w-full p-1 border border-gray-300 rounded text-xs"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => handleChange('fields', [...(values.fields || []), { label: '', placeholder: '' }])}
                                className="w-full py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                            >
                                + 입력 필드 추가
                            </button>
                        </div>
                    </>
                )}

                {/* Social Block */}
                {selectedBlock.type === 'social' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">아이콘 색상</label>
                            <input
                                type="color"
                                value={styles.iconColor || '#333333'}
                                onChange={(e) => handleStyleChange('iconColor', e.target.value)}
                                className="w-full h-8 p-0 border rounded cursor-pointer"
                            />
                        </div>
                        <div className="space-y-3">
                            {['facebook', 'instagram', 'twitter', 'youtube', 'website'].map(platform => (
                                <div key={platform}>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{platform}</label>
                                    <input
                                        type="text"
                                        value={(values.links && values.links[platform]) || ''}
                                        onChange={(e) => {
                                            const newLinks = { ...(values.links || {}), [platform]: e.target.value };
                                            handleChange('links', newLinks);
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        placeholder={`https://${platform}.com/...`}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Gallery Block */}
                {selectedBlock.type === 'gallery' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">열 개수 (Columns)</label>
                            <select
                                value={styles.columns || 2}
                                onChange={(e) => handleStyleChange('columns', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="1">1열</option>
                                <option value="2">2열</option>
                                <option value="3">3열</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">갤러리 이미지 관리</label>
                            <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">이미지 업로드</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                handleChange('images', [...(values.images || []), reader.result]);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <div className="space-y-2">
                                {(values.images || []).map((img, idx) => (
                                    <div key={idx} className="flex gap-2 items-center p-2 border rounded bg-gray-50">
                                        <div className="w-16 h-16 flex-shrink-0 bg-white border rounded overflow-hidden">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <input
                                            type="text"
                                            value={img}
                                            onChange={(e) => {
                                                const newImages = [...(values.images || [])];
                                                newImages[idx] = e.target.value;
                                                handleChange('images', newImages);
                                            }}
                                            className="flex-1 p-2 border border-gray-300 rounded text-xs"
                                            placeholder="Image URL"
                                        />
                                        <button
                                            onClick={() => {
                                                const newImages = values.images.filter((_, i) => i !== idx);
                                                handleChange('images', newImages);
                                            }}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded"
                                            title="삭제"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => handleChange('images', [...(values.images || []), ''])}
                                className="w-full py-2 bg-gray-50 text-gray-600 rounded-md text-xs hover:bg-gray-100 mt-2"
                            >
                                + URL로 이미지 추가
                            </button>
                        </div>
                    </>
                )}

                {/* Business Block */}
                {selectedBlock.type === 'business' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">사업명</label>
                            <input
                                type="text"
                                value={values.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 노인복지 프로그램"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">사업 설명</label>
                            <textarea
                                value={values.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm h-20"
                                placeholder="사업에 대한 상세 설명을 입력하세요."
                            />
                        </div>

                        <div className="space-y-4 border-t pt-4 my-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">텍스트 스타일</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">정렬</label>
                                    <select
                                        value={styles.textAlign || 'left'}
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="center">중앙</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">크기</label>
                                    <select
                                        value={styles.fontSize || 'medium'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="small">작게</option>
                                        <option value="medium">보통</option>
                                        <option value="large">크게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">굵기</label>
                                    <select
                                        value={styles.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="normal">보통</option>
                                        <option value="bold">굵게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">상세 항목 (이용 대상, 이용료 등)</label>
                                <button
                                    onClick={() => handleChange('items', [...(values.items || []), { label: '', value: '' }])}
                                    className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100"
                                >
                                    + 추가
                                </button>
                            </div>
                            {(values.items || []).length === 0 && (
                                <p className="text-xs text-gray-400 text-center py-2 bg-gray-50 rounded">상세 항목이 없습니다. "+ 추가" 버튼을 클릭하여 항목을 추가하세요.</p>
                            )}
                            {(values.items || []).map((item, idx) => (
                                <div key={idx} className="mb-2 p-2 border border-gray-100 rounded bg-gray-50">
                                    <div className="flex gap-2 mb-1">
                                        <input
                                            type="text"
                                            placeholder="항목명 (예: 이용대상)"
                                            value={item.label}
                                            onChange={(e) => {
                                                const newItems = [...(values.items || [])];
                                                newItems[idx] = { ...item, label: e.target.value };
                                                handleChange('items', newItems);
                                            }}
                                            className="w-1/3 p-1 border border-gray-300 rounded text-xs font-bold"
                                        />
                                        <button
                                            onClick={() => {
                                                const newItems = values.items.filter((_, i) => i !== idx);
                                                handleChange('items', newItems);
                                            }}
                                            className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <textarea
                                        placeholder="내용을 입력하세요"
                                        value={item.value}
                                        onChange={(e) => {
                                            const newItems = [...(values.items || [])];
                                            newItems[idx] = { ...item, value: e.target.value };
                                            handleChange('items', newItems);
                                        }}
                                        className="w-full p-1 border border-gray-300 rounded text-xs h-16"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Schedule Block */}
                {selectedBlock.type === 'schedule' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">행사명</label>
                            <input
                                type="text"
                                value={values.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 행사 일시"
                            />
                        </div>

                        <div className="space-y-4 border-t pt-4 my-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">텍스트 스타일</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">정렬</label>
                                    <select
                                        value={styles.textAlign || 'left'}
                                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="center">중앙</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">크기</label>
                                    <select
                                        value={styles.fontSize || 'medium'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="small">작게</option>
                                        <option value="medium">보통</option>
                                        <option value="large">크게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">굵기</label>
                                    <select
                                        value={styles.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="normal">보통</option>
                                        <option value="bold">굵게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">일정 항목</label>
                            {(values.items || []).map((item, idx) => (
                                <div key={idx} className="mb-3 p-3 border border-gray-200 rounded bg-gray-50 relative">
                                    <button
                                        onClick={() => {
                                            const newItems = values.items.filter((_, i) => i !== idx);
                                            handleChange('items', newItems);
                                        }}
                                        className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="space-y-2 pr-8">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">시작</label>
                                            <input
                                                type="datetime-local"
                                                value={item.startTime || ''}
                                                onChange={(e) => {
                                                    const newItems = [...(values.items || [])];
                                                    newItems[idx] = { ...item, startTime: e.target.value };
                                                    handleChange('items', newItems);
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">종료</label>
                                            <input
                                                type="datetime-local"
                                                value={item.endTime || ''}
                                                onChange={(e) => {
                                                    const newItems = [...(values.items || [])];
                                                    newItems[idx] = { ...item, endTime: e.target.value };
                                                    handleChange('items', newItems);
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">장소</label>
                                            <input
                                                type="text"
                                                placeholder="예: 복지관 1층 대강당"
                                                value={item.location || ''}
                                                onChange={(e) => {
                                                    const newItems = [...(values.items || [])];
                                                    newItems[idx] = { ...item, location: e.target.value };
                                                    handleChange('items', newItems);
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => handleChange('items', [...(values.items || []), { startTime: '', endTime: '', location: '' }])}
                                className="w-full py-2 border border-blue-200 text-blue-600 rounded-md text-sm hover:bg-blue-50 mt-2"
                            >
                                + 일정 추가하기
                            </button>
                        </div>
                    </>
                )}

                {/* Link Block */}
                {selectedBlock.type === 'link' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">버튼 텍스트</label>
                            <input
                                type="text"
                                value={values.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 홈페이지 바로가기"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                            <input
                                type="text"
                                value={values.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-4 border-t pt-4 my-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase">버튼 스타일</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">배경 색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">호버 배경 색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.hoverBackgroundColor || styles.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleStyleChange('hoverBackgroundColor', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">텍스트 색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={styles.color || '#000000'}
                                            onChange={(e) => handleStyleChange('color', e.target.value)}
                                            className="w-8 h-8 p-0 border rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">크기</label>
                                    <select
                                        value={styles.fontSize || 'medium'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="small">작게</option>
                                        <option value="medium">보통</option>
                                        <option value="large">크게</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">굵기</label>
                                    <select
                                        value={styles.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="normal">보통</option>
                                        <option value="bold">굵게</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">버튼 크기</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">위아래 여백</label>
                                        <select
                                            value={styles.paddingVertical || '18px'}
                                            onChange={(e) => handleStyleChange('paddingVertical', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        >
                                            <option value="8px">작게 (8px)</option>
                                            <option value="12px">약간 작게 (12px)</option>
                                            <option value="16px">보통 (16px)</option>
                                            <option value="18px">약간 크게 (18px)</option>
                                            <option value="24px">크게 (24px)</option>
                                            <option value="32px">매우 크게 (32px)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">좌우 여백</label>
                                        <select
                                            value={styles.paddingHorizontal || '24px'}
                                            onChange={(e) => handleStyleChange('paddingHorizontal', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        >
                                            <option value="12px">작게 (12px)</option>
                                            <option value="16px">약간 작게 (16px)</option>
                                            <option value="20px">보통 (20px)</option>
                                            <option value="24px">약간 크게 (24px)</option>
                                            <option value="32px">크게 (32px)</option>
                                            <option value="48px">매우 크게 (48px)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Map Block */}
                {selectedBlock.type === 'map' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">장소명</label>
                            <input
                                type="text"
                                value={values.placeName || ''}
                                onChange={(e) => handleChange('placeName', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 서울시청"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                            <input
                                type="text"
                                value={values.address || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 서울특별시 중구 세종대로 110"
                            />
                            <p className="text-xs text-gray-400 mt-1">정확한 주소를 입력해야 지도가 올바르게 표시됩니다.</p>
                        </div>
                    </>
                )}

                {/* Share Block */}
                {selectedBlock.type === 'share' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">공유 제목</label>
                            <input
                                type="text"
                                value={values.shareTitle || ''}
                                onChange={(e) => handleChange('shareTitle', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="공유될 때 표시될 제목"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">공유 설명</label>
                            <textarea
                                value={values.shareDescription || ''}
                                onChange={(e) => handleChange('shareDescription', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm h-20"
                                placeholder="공유될 때 표시될 설명"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">공유 썸네일 이미지</label>
                            <div className="mb-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'shareImage')}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            {values.shareImage && (
                                <div className="mt-2">
                                    <img src={values.shareImage} alt="Share Thumbnail" className="w-full h-32 object-cover rounded border" />
                                    <button
                                        onClick={() => handleChange('shareImage', '')}
                                        className="text-xs text-red-500 mt-1 hover:underline"
                                    >
                                        이미지 제거
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="pt-6 border-t mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">블록 관리</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleMove('up')}
                            className="flex-1 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex justify-center items-center gap-1"
                        >
                            <ArrowUp size={16} /> 위로
                        </button>
                        <button
                            onClick={() => handleMove('down')}
                            className="flex-1 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 flex justify-center items-center gap-1"
                        >
                            <ArrowDown size={16} /> 아래로
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PropertyPanel;
