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
        alert('Link copied to clipboard! Open it in a new tab to view.');
    };

    const handleSave = () => {
        if (password.length !== 4) {
            alert('Please enter a 4-digit password.');
            return;
        }

        const project = {
            id: Date.now(),
            title: state.projectMeta.title,
            updatedAt: new Date().toISOString(),
            blocks: state.blocks,
            password: password,
        };

        const saved = JSON.parse(localStorage.getItem('my_projects') || '[]');
        localStorage.setItem('my_projects', JSON.stringify([...saved, project]));
        alert('Project saved!');
        setShowSaveModal(false);
        dispatch({ type: 'SET_VIEW', payload: 'landing' });
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
                    Save
                </button>
                <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                >
                    <Share size={18} />
                    Publish
                </button>
            </div>

            {showSaveModal && (
                <div className="absolute top-16 right-6 w-80 bg-white shadow-xl rounded-xl border border-gray-200 p-6 z-50 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-bold text-lg mb-2">Save Project</h3>
                    <p className="text-sm text-gray-500 mb-4">Set a 4-digit password to protect your project.</p>
                    <input
                        type="password"
                        maxLength={4}
                        placeholder="Password (4 digits)"
                        className="w-full p-2 border rounded mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowSaveModal(false)} className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
