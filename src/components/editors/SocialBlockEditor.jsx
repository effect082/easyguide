import React from 'react';

const SocialBlockEditor = ({ values, styles, handleChange, handleStyleChange }) => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이콘 색상</label>
                <input
                    type="color"
                    value={styles.iconColor || '#333333'}
                    onChange={(e) => handleStyleChange('iconColor', e.target.value)}
                    className="w-full h-8 p-0 border rounded cursor-pointer"
                />
            </div>
            <div className="space-y-3">
                {['facebook', 'instagram', 'twitter', 'youtube', 'website'].map(platform => (
                    <div key={platform}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{platform}</label>
                        <input
                            type="text"
                            value={(values.links && values.links[platform]) || ''}
                            onChange={(e) => {
                                const newLinks = { ...(values.links || {}), [platform]: e.target.value };
                                handleChange('links', newLinks);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder={`https://${platform}.com/...`}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default SocialBlockEditor;
