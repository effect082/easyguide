import React from 'react';
import { MapPin } from 'lucide-react';

const MapBlock = ({ content, styles }) => {
    const { placeName = 'Place Name', address = 'Address' } = content;
    const { backgroundColor = 'transparent' } = styles || {};

    // In a real app, we would use Google Maps API or similar.
    // Here we use a static placeholder or an iframe if we had an API key.
    // For this demo, we'll simulate a map view.

    return (
        <div style={{ backgroundColor, padding: '20px' }}>
            <div className="bg-gray-200 rounded-lg overflow-hidden h-64 relative flex items-center justify-center">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>

                <div className="z-10 text-center p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm max-w-[80%]">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full mb-2">
                        <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900">{placeName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{address}</p>
                </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
                <div className="text-xs text-gray-400">지도 보기</div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:underline"
                >
                    길찾기 &gt;
                </a>
            </div>
        </div>
    );
};

export default MapBlock;
