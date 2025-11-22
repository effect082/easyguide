import React from 'react';
import Header from './Header';

const Layout = ({ leftPanel, canvas, rightPanel }) => {
    return (
        <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Block Tools */}
                <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col z-0">
                    {leftPanel}
                </aside>

                {/* Center: Canvas */}
                <main className="flex-1 relative overflow-hidden flex flex-col items-center justify-center bg-gray-50 p-8">
                    <div className="w-full h-full max-w-[500px] flex flex-col">
                        {canvas}
                    </div>
                </main>

                {/* Right Panel: Properties */}
                <aside className="w-80 bg-white border-l border-gray-200 flex-shrink-0 flex flex-col z-0">
                    {rightPanel}
                </aside>
            </div>
        </div>
    );
};

export default Layout;
