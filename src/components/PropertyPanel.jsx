import React, { useEffect, useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

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

    const handleImageUpload = (e, key = 'src') => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange(key, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!selectedBlock) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p>편집할 블록을 선택하세요.</p>
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

                {/* Text Block */}
                {selectedBlock.type === 'text' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">텍스트 내용 (HTML)</label>
                        <textarea
                            value={values.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md h-32 text-sm font-mono"
                        />
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">폰트 크기</label>
                            <select
                                value={styles.fontSize || 'medium'}
                                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="small">작게 (20px)</option>
                                <option value="medium">보통 (24px)</option>
                                <option value="large">크게 (32px)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">정렬</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">텍스트 색상</label>
                            <input
                                type="color"
                                value={styles.color || '#000000'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="w-full h-8 p-0 border rounded cursor-pointer"
                            />
                        </div>
                    </>
                )}

                {/* Image Block */}
                {selectedBlock.type === 'image' && (
                    <>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">슬라이드 이미지</label>
                            {(values.images || []).map((img, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => {
                                            const newImages = [...(values.images || [])];
                                            newImages[idx] = e.target.value;
                                            handleChange('images', newImages);
                                        }}
                                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = values.images.filter((_, i) => i !== idx);
                                            handleChange('images', newImages);
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => handleChange('images', [...(values.images || []), ''])}
                                className="w-full py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100"
                            >
                                + 슬라이드 추가
                            </button>
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
                                value={values.buttonText || 'Submit'}
                                onChange={(e) => handleChange('buttonText', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">입력 필드</label>
                            {(values.fields || []).map((field, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Placeholder"
                                        value={field.placeholder || ''}
                                        onChange={(e) => {
                                            const newFields = [...(values.fields || [])];
                                            newFields[idx] = { ...field, placeholder: e.target.value };
                                            handleChange('fields', newFields);
                                        }}
                                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const newFields = values.fields.filter((_, i) => i !== idx);
                                            handleChange('fields', newFields);
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => handleChange('fields', [...(values.fields || []), { placeholder: '' }])}
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
                            {(values.images || []).map((img, idx) => (
                                <div key={idx} className="flex gap-2 mb-2 items-center">
                                    <img src={img} alt="" className="w-8 h-8 object-cover rounded border" />
                                    <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => {
                                            const newImages = [...(values.images || [])];
                                            newImages[idx] = e.target.value;
                                            handleChange('images', newImages);
                                        }}
                                        className="flex-1 p-1 border border-gray-300 rounded text-xs"
                                        placeholder="Image URL"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = values.images.filter((_, i) => i !== idx);
                                            handleChange('images', newImages);
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">일정 제목</label>
                            <input
                                type="text"
                                value={values.title || ''}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 결혼식, 돌잔치, 모임"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">상세 항목</label>
                            {(values.items || []).map((item, idx) => (
                                <div key={idx} className="mb-2 p-2 border border-gray-100 rounded bg-gray-50 relative">
                                    <button
                                        onClick={() => {
                                            const newItems = values.items.filter((_, i) => i !== idx);
                                            handleChange('items', newItems);
                                        }}
                                        className="absolute top-1 right-1 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="flex gap-2 mb-1 pr-6">
                                        <input
                                            type="text"
                                            placeholder="시간 (예: 14:00)"
                                            value={item.time}
                                            onChange={(e) => {
                                                const newItems = [...(values.items || [])];
                                                newItems[idx] = { ...item, time: e.target.value };
                                                handleChange('items', newItems);
                                            }}
                                            className="w-1/3 p-1 border border-gray-300 rounded text-xs font-bold"
                                        />
                                        <input
                                            type="text"
                                            placeholder="이벤트명 (예: 본식 시작)"
                                            value={item.event}
                                            onChange={(e) => {
                                                const newItems = [...(values.items || [])];
                                                newItems[idx] = { ...item, event: e.target.value };
                                                handleChange('items', newItems);
                                            }}
                                            className="flex-1 p-1 border border-gray-300 rounded text-xs"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="설명 (선택사항)"
                                        value={item.description || ''}
                                        onChange={(e) => {
                                            const newItems = [...(values.items || [])];
                                            newItems[idx] = { ...item, description: e.target.value };
                                            handleChange('items', newItems);
                                        }}
                                        className="w-full p-1 border border-gray-300 rounded text-xs h-12"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => handleChange('items', [...(values.items || []), { time: '', event: '', description: '' }])}
                                className="w-full py-2 border border-blue-200 text-blue-600 rounded-md text-xs hover:bg-blue-50 mt-2"
                            >
                                + 항목 추가하기
                            </button>
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
                                placeholder="예: 중앙공원"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                            <input
                                type="text"
                                value={values.address || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="예: 서울시 강남구 테헤란로 123"
                            />
                        </div>
                    </>
                )}

                {/* Block Management */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 mb-3">블록 관리</h3>
                    <div className="flex gap-2 mb-3">
                        <button onClick={() => handleMove('up')} className="flex-1 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 flex justify-center items-center gap-1">
                            <ArrowUp size={14} /> 위로 이동
                        </button>
                        <button onClick={() => handleMove('down')} className="flex-1 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 flex justify-center items-center gap-1">
                            <ArrowDown size={14} /> 아래로 이동
                        </button>
                    </div>
                    <button onClick={handleDelete} className="w-full py-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 font-medium">
                        블록 삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyPanel;
