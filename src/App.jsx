import React, { useState, Suspense } from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

// Lazy load components
const Layout = React.lazy(() => import('./components/Layout'));
const BlockList = React.lazy(() => import('./components/BlockList'));
const Canvas = React.lazy(() => import('./components/Canvas'));
const PropertyPanel = React.lazy(() => import('./components/PropertyPanel'));
const Landing = React.lazy(() => import('./components/Landing'));
const ViewMode = React.lazy(() => import('./components/ViewMode'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const AppContent = () => {
  const { state, dispatch } = useEditor();

  const [isViewMode] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
    return !!(searchParams.get('view') || searchParams.get('project') || hashParams.get('view') || hashParams.get('project'));
  });

  const [viewUuid] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');

    const projectParam = searchParams.get('project') || hashParams.get('project');
    const viewParam = searchParams.get('view') || hashParams.get('view');

    if (projectParam) return projectParam;
    if (viewParam === 'true') return null;
    return viewParam || null;
  });

  // 2. Main Application (No Authentication Required)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 1. View Mode (Public Access)
  if (isViewMode) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ViewMode uuid={viewUuid} />
      </Suspense>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // 1. Dropping a new block from BlockList
    if (active.id.toString().startsWith('draggable-')) {
      const type = active.data.current?.type;
      if (type) {
        dispatch({ type: 'ADD_BLOCK', payload: { type } });
      }
      return;
    }

    // 2. Reordering blocks in Canvas
    if (active.id !== over.id) {
      const oldIndex = state.blocks.findIndex((b) => b.id === active.id);
      const newIndex = state.blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(state.blocks, oldIndex, newIndex);
        dispatch({ type: 'REORDER_BLOCKS', payload: newBlocks });
      }
    }
  };

  if (state.view === 'landing') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Landing />
      </Suspense>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Suspense fallback={<LoadingFallback />}>
        <Layout
          leftPanel={<BlockList />}
          canvas={<Canvas />}
          rightPanel={<PropertyPanel />}
        />
      </Suspense>
      <DragOverlay>
        {/* Optional: Custom drag preview */}
      </DragOverlay>
    </DndContext>
  );
};

function App() {
  return (
    <EditorProvider>
      <AppContent />
    </EditorProvider>
  );
}

export default App;
