import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { Share, Eye, ArrowLeft, Save } from 'lucide-react';

const Header = () => {
    const { state, dispatch } = useEditor();
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [password, setPassword] = useState('');

    const handlePublish = () => {
        const data = JSON.stringify(state.blocks);
        const encoded = btoa(encodeURIComponent(data));
        const url = `${window.location.origin}${window.location.pathname}?view=true&data=${encoded}`;

        // In a real app, we would shorten this URL or save to a DB.
        // For this demo, we just copy to clipboard.
        navigator.clipboard.writeText(url);
        alert('링크가 클립보드에 복사되었습니다! 새 탭에서 열어보세요.');
    };

    const handleSave = () => {
        // If project already has a password, use it. Otherwise prompt for new password.
        const projectPassword = state.projectMeta.password || password;

        if (!state.projectMeta.password && password.length !== 4) {
            alert('4자리 비밀번호를 입력해주세요.');
            return;
        }

        const saved = JSON.parse(localStorage.getItem('my_projects') || '[]');

        // Check if this is an existing project (update) or new project
        const existingIndex = saved.findIndex(p => p.id === state.projectMeta.id);

        const project = {
            id: state.projectMeta.id || Date.now().toString(),
            title: state.projectMeta.title,
            category: state.projectMeta.category,
            type: state.projectMeta.type,
            password: projectPassword,
            author: state.projectMeta.author,
            blocks: state.blocks,
            createdAt: existingIndex >= 0 ? saved[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
            // Update existing project
            saved[existingIndex] = project;
        } else {
            // Add new project
            saved.push(project);
        }

        localStorage.setItem('my_projects', JSON.stringify(saved));
        alert('프로젝트가 저장되었습니다!');
        setShowSaveModal(false);
        setPassword('');

        // Update the project meta with the saved ID and password
        dispatch({
            type: 'SET_PROJECT_META',
            payload: { id: project.id, password: projectPassword }
        });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 relative">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">{state.projectMeta.title}</h1>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                    <Save size={18} />
                    저장
                </button>
                <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                >
                    <Share size={18} />
                    게시
                </button>
            </div>

            {showSaveModal && (
                <div className="absolute top-16 right-6 w-80 bg-white shadow-xl rounded-xl border border-gray-200 p-6 z-50 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-bold text-lg mb-2">프로젝트 저장</h3>
                    <p className="text-sm text-gray-500 mb-4">프로젝트를 보호하기 위해 4자리 비밀번호를 설정하세요.</p>
                    <input
                        type="password"
                        maxLength={4}
                        placeholder="비밀번호 (4자리)"
                        className="w-full p-2 border rounded mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowSaveModal(false)} className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded">취소</button>
                        <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
