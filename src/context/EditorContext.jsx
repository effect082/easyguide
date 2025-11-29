import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EditorContext = createContext();

const initialState = {
    blocks: [], // Array of block objects { id, type, content, styles }
    selectedBlockId: null,
    projectMeta: {
        id: null,
        title: '나의 프로젝트',
        category: '개인',
        type: '뉴스레터',
        password: null,
        author: '',
        theme: 'light',
        backgroundColor: '#ffffff',
    },
    view: 'landing', // 'landing' | 'editor' | 'preview'
};

const editorReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_BLOCK': {
            const newBlock = {
                id: uuidv4(),
                type: action.payload.blockType || action.payload.type,
                content: action.payload.defaultContent || (action.payload.blockType === 'form' ? {
                    title: '입력 폼',
                    buttonText: '제출하기',
                    fields: [
                        { label: '이름', placeholder: '이름을 입력하세요', type: 'text' },
                        { label: '전화번호', placeholder: '전화번호를 입력하세요', type: 'tel' }
                    ]
                } : action.payload.blockType === 'link' ? {
                    title: '❤️ 홈페이지',
                    url: 'https://'
                } : {}),
                styles: action.payload.blockType === 'link' ? {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    borderRadius: '8px'
                } : {},
            };
            return {
                ...state,
                blocks: [...state.blocks, newBlock],
                selectedBlockId: newBlock.id,
            };
        }
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
        case 'LOAD_PROJECT':
            return {
                ...state,
                blocks: action.payload.blocks || [],
                projectMeta: {
                    id: action.payload.id,
                    title: action.payload.title,
                    category: action.payload.category,
                    type: action.payload.type,
                    password: action.payload.password,
                    author: action.payload.author,
                    theme: 'light',
                },
                view: 'editor',
                selectedBlockId: null,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
