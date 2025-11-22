import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EditorContext = createContext();

const initialState = {
    blocks: [], // Array of block objects { id, type, content, styles }
    selectedBlockId: null,
    projectMeta: {
        title: 'My Project',
        theme: 'light',
    },
    view: 'landing', // 'landing' | 'editor' | 'preview'
};

const editorReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_BLOCK':
            const newBlock = {
                id: uuidv4(),
                type: action.payload.type,
                content: action.payload.defaultContent || {},
                styles: {},
            };
            return {
                ...state,
                blocks: [...state.blocks, newBlock],
                selectedBlockId: newBlock.id,
            };
        case 'REMOVE_BLOCK':
            return {
                ...state,
                blocks: state.blocks.filter((b) => b.id !== action.payload),
                selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId,
            };
        case 'UPDATE_BLOCK':
            return {
                ...state,
                blocks: state.blocks.map((b) =>
                    b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
                ),
            };
        case 'REORDER_BLOCKS':
            return {
                ...state,
                blocks: action.payload,
            };
        case 'SELECT_BLOCK':
            return {
                ...state,
                selectedBlockId: action.payload,
            };
        case 'SET_PROJECT_META':
            return {
                ...state,
                projectMeta: { ...state.projectMeta, ...action.payload },
            };
        case 'LOAD_TEMPLATE':
            return {
                ...state,
                blocks: action.payload.defaultBlocks.map(b => ({
                    ...b,
                    id: uuidv4(),
                    styles: b.styles || {}
                })),
                view: 'editor',
            };
        case 'SET_VIEW':
            return {
                ...state,
                view: action.payload,
            };
        default:
            return state;
    }
};

export const EditorProvider = ({ children }) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
