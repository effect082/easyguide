import React from 'react';

const VideoBlock = ({ content, styles }) => {
    return (
        <div style={{ ...styles, padding: '10px' }}>
            {content.src ? (
                <div className="aspect-video bg-black rounded overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        src={content.src.replace('watch?v=', 'embed/')}
                        title="Video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-500 rounded">
                    No Video URL
                </div>
            )}
        </div>
    );
};

export default VideoBlock;
