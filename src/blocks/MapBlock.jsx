import React from 'react';
import { MapPin } from 'lucide-react';

const MapBlock = ({ content, styles }) => {
    const { placeName = '강동어울림복지관', address = '서울시 송파구 올림픽로 57길 9' } = content || {};
    const { backgroundColor = 'transparent' } = styles || {};

    // Encode address for URL
    const encodedAddress = encodeURIComponent(address);

    return (
        <div style={{ backgroundColor, padding: '20px' }}>
            {/* Map Preview */}
            <div className="bg-gray-200 rounded-lg overflow-hidden h-64 relative flex items-center justify-center">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>

                {/* Location Info */}
                <div className="z-10 text-center p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm max-w-[80%]">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full mb-2">
                        <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900">{placeName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{address}</p>
                </div>
            </div>

            {/* Map Service Buttons - Naver and Kakao ONLY */}
            <div className="mt-3 flex gap-2">
                {/* Naver Map Button */}
                <a
                    href={`https://map.naver.com/v5/search/${encodedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#03C75A] text-white rounded-lg font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                >
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    네이버지도
                </a>

                {/* Kakao Map Button */}
                <a
                    href={`https://map.kakao.com/link/search/${encodedAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#FEE500] text-[#000000] rounded-lg font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                >
                    <span className="w-4 h-4 flex items-center justify-center bg-blue-500 rounded-sm">
                        <span className="text-[10px] text-white font-bold">K</span>
                    </span>
                    카카오맵
                </a>
            </div>
        </div>
    );
};

export default MapBlock;
