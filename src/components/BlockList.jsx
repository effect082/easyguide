import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Image, Video, Calendar, MapPin, Link, List, LayoutGrid, Share2 } from 'lucide-react';
import { useEditor } from '../context/EditorContext';

// All available block types for the sidebar
const blockTypes = [
    { type: 'head', label: '헤드(제목)', icon: <Type size={20} /> },
    { type: 'text', label: '텍스트', icon: <Type size={20} /> },
    { type: 'image', label: '이미지', icon: <Image size={20} /> },
    { type: 'slide', label: '슬라이드', icon: <LayoutGrid size={20} /> },
    { type: 'gallery', label: '갤러리', icon: <LayoutGrid size={20} /> },
    { type: 'video', label: '영상', icon: <Video size={20} /> },
    { type: 'business', label: '사업안내', icon: <List size={20} /> },
    { type: 'schedule', label: '일정', icon: <Calendar size={20} /> },
    { type: 'map', label: '지도', icon: <MapPin size={20} /> },
    { type: 'form', label: '입력폼', icon: <List size={20} /> },
    { type: 'link', label: '링크 버튼', icon: <Link size={20} /> },
    { type: 'share', label: '공유하기', icon: <Share2 size={20} /> },
];

const DraggableBlock = ({ type, label, icon }) => {
    const { dispatch } = useEditor();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `draggable-${type}`,
        data: { type, label },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const handleClick = (e) => {
        // Only trigger if not dragging
        if (!transform) {
            e.stopPropagation();
            dispatch({ type: 'ADD_BLOCK', payload: { blockType: type } });
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className="p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-3 shadow-sm"
        >
            <div className="text-gray-500">{icon}</div>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
    );
};

const BlockList = () => {
    // Log to confirm this component is loading with all blocks
    console.log('BlockList loaded with', blockTypes.length, 'block types');

    return (
        <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">블록 도구</h2>
            <div className="grid grid-cols-1 gap-3">
                {blockTypes.map((block) => (
                    <DraggableBlock key={block.type} {...block} />
                ))}
            </div>
        </div>
    );
};

export default BlockList;
