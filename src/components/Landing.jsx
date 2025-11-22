import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { FilePlus, LayoutTemplate, Calendar, MapPin, ArrowRight } from 'lucide-react';

const templates = [
    {
        id: 'newsletter',
        title: 'Newsletter',
        description: 'Share news and updates with a clean, readable layout.',
        icon: <LayoutTemplate size={32} className="text-blue-500" />,
        defaultBlocks: [
            { type: 'text', content: { text: '<h1>Weekly Newsletter</h1><p>Welcome to our weekly update.</p>' } },
            { type: 'image', content: { src: 'https://placehold.co/600x400' } },
            { type: 'text', content: { text: '<p>Here is the main content of the newsletter...</p>' } },
        ]
    },
    {
        id: 'promotion',
        title: 'Promotion',
        description: 'Promote your business or event with eye-catching visuals.',
        icon: <FilePlus size={32} className="text-purple-500" />,
        defaultBlocks: [
            { type: 'image', content: { src: 'https://placehold.co/600x800' } },
            { type: 'text', content: { text: '<h2>Special Offer!</h2><p>Get 50% off this week only.</p>' } },
            { type: 'button', content: { text: 'Shop Now', url: '#' } },
        ]
    },
    {
        id: 'invitation',
        title: 'Invitation',
        description: 'Invite guests to your special event with style.',
        icon: <Calendar size={32} className="text-pink-500" />,
        defaultBlocks: [
            { type: 'text', content: { text: '<h1 style="text-align:center">You are Invited!</h1>' } },
            { type: 'image', content: { src: 'https://placehold.co/600x400' } },
            { type: 'text', content: { text: '<p style="text-align:center">Join us for a celebration.</p>' } },
            { type: 'map', content: { address: 'Seoul, Korea' } },
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Mobile Content Builder</h1>
                <p className="text-gray-600 text-center mb-12">Create beautiful mobile pages in minutes.</p>

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
                                Start Creating <ArrowRight size={16} className="ml-1" />
                            </div>
                        </button>
                    ))}
                </div>

                {projects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {projects.map((project) => (
                                    <li key={project.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{project.title}</h4>
                                            <p className="text-sm text-gray-500">{new Date(project.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-blue-600">Edit</button>
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
