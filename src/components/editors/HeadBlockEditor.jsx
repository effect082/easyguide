import React from 'react';

const HeadBlockEditor = ({ values, styles, handleChange, handleStyleChange }) => {
    return (
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
    );
};

export default HeadBlockEditor;
