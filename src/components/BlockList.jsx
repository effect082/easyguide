import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, Image, Video, Calendar, MapPin, Link, List, LayoutGrid } from 'lucide-react';

const blockTypes = [
    { type: 'text', label: 'Text', icon: <Type size={20} /> },
    { type: 'image', label: 'Image', icon: <Image size={20} /> },
    { type: 'video', label: 'Video', icon: <Video size={20} /> },
    { type: 'schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { type: 'map', label: 'Map', icon: <MapPin size={20} /> },
    { type: 'button', label: 'Button', icon: <Link size={20} /> },
    { type: 'list', label: 'List', icon: <List size={20} /> },
    { type: 'gallery', label: 'Gallery', icon: <LayoutGrid size={20} /> },
];

const DraggableBlock = ({ type, label, icon }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `draggable-${type}`,
        data: { type, label },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-3 shadow-sm"
        >
            <div className="text-gray-500">{icon}</div>
            <span className="font-medium text-gray-700">{label}</span>
        </div>
    );
};

const BlockList = () => {
    return (
        <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Blocks</h2>
            <div className="grid grid-cols-1 gap-3">
                {blockTypes.map((block) => (
                    <DraggableBlock key={block.type} {...block} />
                ))}
            </div>
        </div>
    );
};

export default BlockList;
