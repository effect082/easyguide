import React from 'react';
import { Trash2 } from 'lucide-react';

const BusinessBlockEditor = ({ values, styles, handleChange, handleStyleChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사업명</label>
                <input
                    type="text"
                    value={values.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
                    placeholder="예: 노인복지 프로그램"
                />

                {/* Business Name Styles */}
                <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">사업명 스타일</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">정렬</label>
                            <select
                                value={styles.nameHeading?.textAlign || 'left'}
                                onChange={(e) => handleStyleChange('nameHeading', { ...styles.nameHeading, textAlign: e.target.value })}
                                className="w-full p-1 border border-gray-300 rounded text-xs"
                            >
                                <option value="left">왼쪽</option>
                                <option value="center">중앙</option>
                                <option value="right">오른쪽</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">크기</label>
                            <select
                                value={styles.nameHeading?.fontSize || 'large'}
                                onChange={(e) => handleStyleChange('nameHeading', { ...styles.nameHeading, fontSize: e.target.value })}
                                className="w-full p-1 border border-gray-300 rounded text-xs"
                            >
                                <option value="medium">보통</option>
                                <option value="large">크게</option>
                                <option value="xlarge">더 크게</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">굵기</label>
                            <select
                                value={styles.nameHeading?.fontWeight || 'bold'}
                                onChange={(e) => handleStyleChange('nameHeading', { ...styles.nameHeading, fontWeight: e.target.value })}
                                className="w-full p-1 border border-gray-300 rounded text-xs"
                            >
                                <option value="normal">보통</option>
                                <option value="bold">굵게</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">색상</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={styles.nameHeading?.color || '#000000'}
                                    onChange={(e) => handleStyleChange('nameHeading', { ...styles.nameHeading, color: e.target.value })}
                                    className="w-6 h-6 p-0 border rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사업 설명</label>
                <textarea
                    value={values.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm h-20 mb-2"
                    placeholder="사업에 대한 상세 설명을 입력하세요."
                />

                {/* Description Styles */}
                <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">설명 스타일</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">정렬</label>
                            <select
                                value={styles.descriptionText?.textAlign || 'left'}
                                onChange={(e) => handleStyleChange('descriptionText', { ...styles.descriptionText, textAlign: e.target.value })}
                                className="w-full p-1 border border-gray-300 rounded text-xs"
                            >
                                <option value="left">왼쪽</option>
                                <option value="center">중앙</option>
                                <option value="right">오른쪽</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">크기</label>
                            <select
                                value={styles.descriptionText?.fontSize || 'medium'}
                                onChange={(e) => handleStyleChange('descriptionText', { ...styles.descriptionText, fontSize: e.target.value })}
                                className="w-full p-1 border border-gray-300 rounded text-xs"
                            >
                                <option value="small">작게</option>
                                <option value="medium">보통</option>
                                <option value="large">크게</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">굵기</label>
                            <select
                                value={styles.descriptionText?.fontWeight || 'normal'}
                                onChange={(e) => handleStyleChange('descriptionText', { ...styles.descriptionText, fontWeight: e.target.value })}
                                className="w-full p-1 border border-gray-300 rounded text-xs"
                            >
                                <option value="normal">보통</option>
                                <option value="bold">굵게</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">색상</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={styles.descriptionText?.color || '#000000'}
                                    onChange={(e) => handleStyleChange('descriptionText', { ...styles.descriptionText, color: e.target.value })}
                                    className="w-6 h-6 p-0 border rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Items */}
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
        </div>
    );
};

export default BusinessBlockEditor;
