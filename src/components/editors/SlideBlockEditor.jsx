import React from 'react';
import { Trash2 } from 'lucide-react';

const SlideBlockEditor = ({ values, styles, handleChange, handleStyleChange }) => {
    return (
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
    );
};

export default SlideBlockEditor;
