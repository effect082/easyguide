import React from 'react';
import { Trash2 } from 'lucide-react';

const FormBlockEditor = ({ values, styles, handleChange, handleStyleChange }) => {
    return (
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
    );
};

export default FormBlockEditor;
