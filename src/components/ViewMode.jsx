import React, { useEffect, useState } from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

const ViewMode = () => {
    const [blocks, setBlocks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const data = params.get('data');
            if (data) {
                const decoded = decodeURIComponent(atob(data));
                setBlocks(JSON.parse(decoded));
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load content. The URL might be invalid.');
        }
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-[480px] bg-white min-h-screen shadow-lg">
                {blocks.map((block) => (
                    <div key={block.id} className="relative">
                        <BlockRenderer block={block} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewMode;
