import React from 'react';
import { Share2 } from 'lucide-react';

const ShareBlock = ({ content, styles }) => {
    const {
        shareTitle = '',
        shareDescription = '',
        shareImage = '',
        buttonText = '카카오톡 공유하기'
    } = content || {};

    const {
        backgroundColor = 'transparent',
        padding = '20px',
        buttonColor = '#FEE500', // Kakao Yellow
        textColor = '#000000',
        borderRadius = '8px'
    } = styles || {};

    const handleShare = () => {
        if (window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY || 'YOUR_KAKAO_JAVASCRIPT_KEY';
                try {
                    window.Kakao.init(KAKAO_KEY);
                } catch (e) {
                    console.error('Kakao init failed:', e);
                    alert('카카오톡 SDK 초기화에 실패했습니다.');
                    return;
                }
            }

            const currentUrl = window.location.href.split('#')[0];

            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: shareTitle || document.title,
                    description: shareDescription || '공유된 콘텐츠를 확인해보세요.',
                    imageUrl: shareImage || '',
                    link: {
                        mobileWebUrl: currentUrl,
                        webUrl: currentUrl,
                    },
                },
                buttons: [
                    {
                        title: '자세히 보기',
                        link: {
                            mobileWebUrl: currentUrl,
                            webUrl: currentUrl,
                        },
                    },
                ],
            });
        } else {
            alert('카카오톡 SDK가 로드되지 않았습니다.');
        }
    };

    return (
        <div style={{ backgroundColor, padding }} className="flex flex-col items-center">
            <button
                onClick={handleShare}
                style={{
                    backgroundColor: buttonColor,
                    color: textColor,
                    borderRadius,
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    maxWidth: '300px',
                    justifyContent: 'center'
                }}
                className="hover:opacity-90 transition-opacity shadow-sm"
            >
                <Share2 size={20} />
                {buttonText}
            </button>

            {/* Helper text for editor to know this block controls share metadata */}
            <div className="mt-2 text-xs text-gray-400 text-center">
                * 이 블록은 공유하기 썸네일 설정에도 사용됩니다.
            </div>
        </div>
    );
};

export default ShareBlock;
