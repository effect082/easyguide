import React from 'react';
import { Trash2 } from 'lucide-react';

const GalleryBlockEditor = ({ values, styles, handleChange, handleStyleChange }) => {
    return (
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
    );
};

export default GalleryBlockEditor;
