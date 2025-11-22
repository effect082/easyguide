import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Plus, X } from 'lucide-react';

const Landing = () => {
    const { dispatch } = useEditor();
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('my_projects');
        return saved ? JSON.parse(saved) : [];
    });
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('전체'); // 전체, 개인, 팀
    const [formData, setFormData] = useState({
        title: '',
        category: '개인',
        type: '뉴스레터',
        password: '',
        author: ''
    });

    const handleCreateProject = () => {
        if (!formData.title || !formData.password || !formData.author) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (formData.password.length !== 4 || !/^\d{4}$/.test(formData.password)) {
            alert('비밀번호는 4자리 숫자여야 합니다.');
            return;
        }

        const newProject = {
            id: Date.now().toString(),
            title: formData.title,
            category: formData.category,
            type: formData.type,
            password: formData.password,
            author: formData.author,
            blocks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem('my_projects', JSON.stringify(updatedProjects));

        // Load project into editor
        dispatch({ type: 'LOAD_PROJECT', payload: newProject });

        // Reset form
        setFormData({
            title: '',
            category: '개인',
            type: '뉴스레터',
            password: '',
            author: ''
        });
        setShowModal(false);
    };

    const handleEditProject = (project) => {
        const enteredPassword = prompt('비밀번호를 입력하세요 (4자리):');
        if (enteredPassword === project.password) {
            dispatch({ type: 'LOAD_PROJECT', payload: project });
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleDeleteProject = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const enteredPassword = prompt('삭제하려면 비밀번호를 입력하세요 (4자리):');
        if (enteredPassword === project.password) {
            if (window.confirm('정말 삭제하시겠습니까?')) {
                const updatedProjects = projects.filter(p => p.id !== projectId);
                setProjects(updatedProjects);
                localStorage.setItem('my_projects', JSON.stringify(updatedProjects));
            }
        } else if (enteredPassword !== null) {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    const filteredProjects = projects.filter(p => {
        if (activeTab === '전체') return true;
        return p.category === activeTab;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 오후 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">내 프로젝트</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                    >
                        <Plus size={20} />
                        새 프로젝트 만들기
                    </button>
                </div>

                <p className="text-gray-600 mb-6">만들어진 콘텐츠를 관리하고 새로운 프로젝트를 시작하세요.</p>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-200 mb-6">
                    {['전체', '개인', '팀'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 font-medium transition-colors ${activeTab === tab
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                <button
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                                <div className="text-center">
                                    <div className="text-6xl mb-2">📄</div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${project.category === '팀'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {project.category}
                                    </span>
                                    <span className="text-xs text-gray-400">{formatDate(project.createdAt)}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{project.title}</h3>
                                <p className="text-sm text-gray-500 truncate">{project.author} · {project.type}</p>
                                <button
                                    onClick={() => handleEditProject(project)}
                                    className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-blue-600 font-medium border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                >
                                    편집
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p>프로젝트가 없습니다.</p>
                        <p className="text-sm mt-2">새 프로젝트를 만들어보세요!</p>
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">새 프로젝트 만들기</h2>

                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">제목</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="예: 5월 가정의 달 행사 초대"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">분류</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['개인', '팀'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`py-3 rounded-lg border-2 font-medium transition-all ${formData.category === cat
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">유형 선택</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['뉴스레터', '홍보', '초대장'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`py-3 rounded-lg border-2 font-medium transition-all text-sm ${formData.type === type
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">비밀번호 (4자리, 숫자 방지용)</label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        setFormData({ ...formData, password: value });
                                    }}
                                    placeholder="숫자 4자리"
                                    maxLength={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">작성자명 또는 팀명</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="예: 복지센터"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCreateProject}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                생성하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
