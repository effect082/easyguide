import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { FilePlus, LayoutTemplate, Calendar, MapPin, ArrowRight } from 'lucide-react';

const templates = [
    {
        id: 'newsletter',
        title: '뉴스레터',
        description: '깔끔하고 읽기 쉬운 레이아웃으로 소식과 업데이트를 공유하세요.',
        icon: <LayoutTemplate size={32} className="text-blue-500" />,
        defaultBlocks: [
            { type: 'text', content: { text: '<h1>주간 뉴스레터</h1><p>이번 주 소식을 전해드립니다.</p>' } },
            { type: 'image', content: { src: 'https://placehold.co/600x400' } },
            { type: 'text', content: { text: '<p>뉴스레터의 주요 내용이 들어갑니다...</p>' } },
        ]
    },
    {
        id: 'promotion',
        title: '홍보 페이지',
        description: '눈길을 사로잡는 비주얼로 비즈니스나 이벤트를 홍보하세요.',
        icon: <FilePlus size={32} className="text-purple-500" />,
        defaultBlocks: [
            { type: 'image', content: { src: 'https://placehold.co/600x800' } },
            { type: 'text', content: { text: '<h2>특별 할인!</h2><p>이번 주에만 50% 할인 혜택을 드립니다.</p>' } },
            { type: 'button', content: { text: '지금 구매하기', url: '#' } },
        ]
    },
    {
        id: 'invitation',
        title: '초대장',
        description: '특별한 행사에 소중한 분들을 초대하세요.',
        icon: <Calendar size={32} className="text-pink-500" />,
        defaultBlocks: [
            { type: 'text', content: { text: '<h1 style="text-align:center">초대합니다!</h1>' } },
            { type: 'image', content: { src: 'https://placehold.co/600x400' } },
            { type: 'text', content: { text: '<p style="text-align:center">기쁜 날 함께해 주세요.</p>' } },
            { type: 'map', content: { address: '서울시 강남구' } },
        ]
    },
];

const Landing = () => {
    const { dispatch } = useEditor();
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('my_projects');
        return saved ? JSON.parse(saved) : [];
    });

    const handleSelectTemplate = (template) => {
        dispatch({ type: 'LOAD_TEMPLATE', payload: template });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">모바일 콘텐츠 빌더</h1>
                <p className="text-gray-600 text-center mb-12">누구나 쉽게 만드는 아름다운 모바일 페이지</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center group"
                        >
                            <div className="mb-6 p-4 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                                {template.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.title}</h3>
                            <p className="text-gray-500 text-sm mb-6">{template.description}</p>
                            <div className="mt-auto flex items-center text-blue-600 font-medium text-sm">
                                제작 시작하기 <ArrowRight size={16} className="ml-1" />
                            </div>
                        </button>
                    ))}
                </div>

                {projects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">내 프로젝트</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {projects.map((project) => (
                                    <li key={project.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{project.title}</h4>
                                            <p className="text-sm text-gray-500">{new Date(project.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-blue-600">편집</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Landing;
