import React, { useEffect, useState } from 'react';
import { useEditor } from '../context/EditorContext';

const PropertyPanel = () => {
    const { state, dispatch } = useEditor();
    const selectedBlock = state.blocks.find(b => b.id === state.selectedBlockId);
    const [values, setValues] = useState({});

    useEffect(() => {
        if (selectedBlock) {
            setValues(selectedBlock.content);
        }
    }, [selectedBlock]);

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
        dispatch({
            type: 'UPDATE_BLOCK',
            payload: {
                id: selectedBlock.id,
                updates: {
                    content: { ...selectedBlock.content, [key]: value }
                }
            }
        });
    };

    if (!selectedBlock) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p>Select a block to edit its properties.</p>
            </div>
        );
    }

    return (
        <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">Edit {selectedBlock.type}</h2>

            <div className="space-y-4">
                {selectedBlock.type === 'text' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Content (HTML)</label>
                        <textarea
                            value={values.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md h-32 text-sm font-mono"
                        />
                    </div>
                )}

                {(selectedBlock.type === 'image' || selectedBlock.type === 'video') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
                        <input
                            type="text"
                            value={values.src || ''}
                            onChange={(e) => handleChange('src', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter a valid image or video URL.</p>
                    </div>
                )}

                {/* Add more property controls here for other block types */}

                <div className="pt-4 border-t mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Styles</h3>
                    {/* Example style controls */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Padding</label>
                            <input type="text" className="w-full p-1 border rounded text-sm" placeholder="10px" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Background</label>
                            <input type="color" className="w-full h-8 p-0 border rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyPanel;
