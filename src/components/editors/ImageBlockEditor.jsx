import React from 'react';
import { Trash2 } from 'lucide-react';

const ImageBlockEditor = ({ values, handleChange, handleImageUpload }) => {
    return (
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
    );
};

export default ImageBlockEditor;
