import React, { useEffect, useState } from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Layout from './components/Layout';
import BlockList from './components/BlockList';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import Landing from './components/Landing';
import ViewMode from './components/ViewMode';

const AppContent = () => {
  const { state, dispatch } = useEditor();
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'true') {
      setIsViewMode(true);
    }
  }, []);

  if (isViewMode) {
    return <ViewMode />;
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
    return <Landing />;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Layout
        leftPanel={<BlockList />}
        canvas={<Canvas />}
        rightPanel={<PropertyPanel />}
      />
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
