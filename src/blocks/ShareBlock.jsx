import React from 'react';

const ShareBlock = ({ content }) => {
    const { shareType, shareTitle, shareDescription, shareImage } = content;

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            margin: '10px 0'
        }}>
            <div style={{ textAlign: 'center', color: '#6c757d', fontSize: '14px' }}>
                <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                    📱 소셜 공유 미리보기
                </div>
                <div style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                    textAlign: 'left'
                }}>
                    {shareImage && (
                        <img
                            src={shareImage}
                            alt="share preview"
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginBottom: '10px'
                            }}
                        />
                    )}
                    <div style={{ fontWeight: 'bold', color: '#212529', marginBottom: '5px' }}>
                        {shareType} {shareTitle && `"${shareTitle}"`}
                    </div>
                    {shareDescription && (
                        <div style={{ color: '#6c757d', fontSize: '13px', whiteSpace: 'pre-wrap' }}>
                            {shareDescription}
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    * 이 블록은 미리보기에만 표시되며, 실제 게시된 페이지에는 나타나지 않습니다.
                </div>
            </div>
        </div>
    );
};

export default ShareBlock;
