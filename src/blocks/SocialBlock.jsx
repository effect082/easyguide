import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Globe } from 'lucide-react';

const SocialBlock = ({ content, styles }) => {
    const { links = {} } = content;
    const { backgroundColor = 'transparent', iconColor = '#333333' } = styles || {};

    const getIcon = (platform) => {
        switch (platform) {
            case 'facebook': return <Facebook size={24} />;
            case 'instagram': return <Instagram size={24} />;
            case 'twitter': return <Twitter size={24} />;
            case 'youtube': return <Youtube size={24} />;
            default: return <Globe size={24} />;
        }
    };

    const platforms = Object.keys(links).filter(key => links[key]);

    if (platforms.length === 0) {
        return (
            <div className="p-4 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg m-4">
                No Social Links Added
            </div>
        );
    }

    return (
        <div style={{ backgroundColor, padding: '20px' }} className="flex justify-center gap-6">
            {platforms.map((platform) => (
                <a
                    key={platform}
                    href={links[platform]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: iconColor }}
                >
                    {getIcon(platform)}
                </a>
            ))}
        </div>
    );
};

export default SocialBlock;
