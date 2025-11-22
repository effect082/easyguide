import React from 'react';
import { useEditor } from '../context/EditorContext';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import BlockRenderer from '../blocks/BlockRenderer';

const SortableBlock = ({ block }) => {
    const { state, dispatch } = useEditor();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isSelected = state.selectedBlockId === block.id;

    const handleSelect = (e) => {
        e.stopPropagation();
        dispatch({ type: 'SELECT_BLOCK', payload: block.id });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        dispatch({ type: 'REMOVE_BLOCK', payload: block.id });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={handleSelect}
            className={`relative group mb-2 rounded-lg border-2 transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'
                }`}
        >
            {/* Block Content Renderer */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <BlockRenderer block={block} />
            </div>

            {/* Controls (Visible on Hover/Select) */}
            <div className={`absolute -right-10 top-0 flex flex-col gap-1 ${isSelected || 'group-hover:flex hidden'}`}>
                <div {...listeners} {...attributes} className="p-2 bg-white shadow rounded text-gray-500 cursor-grab hover:text-blue-600">
                    <GripVertical size={16} />
                </div>
                <button onClick={handleDelete} className="p-2 bg-white shadow rounded text-gray-500 hover:text-red-600">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

const Canvas = () => {
    const { state } = useEditor();
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable',
    });

    return (
        <div className="flex-1 bg-white shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-gray-900 relative mx-auto w-full max-w-[400px] h-[800px]">
            {/* Phone Notch */}
            <div className="absolute top-0 left-0 right-0 h-7 bg-gray-900 z-20 flex justify-center">
                <div className="w-32 h-5 bg-black rounded-b-xl"></div>
            </div>

            {/* Scrollable Content Area */}
            <div
                ref={setNodeRef}
                className="h-full overflow-y-auto pt-10 pb-20 px-4 scrollbar-hide bg-gray-50"
            >
                <SortableContext
                    items={state.blocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {state.blocks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl m-4">
                            <p>블록을 이곳으로 드래그하세요</p>
                        </div>
                    ) : (
                        state.blocks.map((block) => (
                            <SortableBlock key={block.id} block={block} />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default Canvas;
