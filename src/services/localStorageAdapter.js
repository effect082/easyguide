export const localStorageAdapter = {
    // Projects
    getProjects: async () => {
        const saved = localStorage.getItem('my_projects');
        return saved ? JSON.parse(saved) : [];
    },

    saveProject: async (project) => {
        const projects = await localStorageAdapter.getProjects();
        const index = projects.findIndex(p => p.id === project.id);

        let updatedProjects;
        if (index >= 0) {
            updatedProjects = [...projects];
            updatedProjects[index] = project;
        } else {
            updatedProjects = [...projects, project];
        }

        try {
            localStorage.setItem('my_projects', JSON.stringify(updatedProjects));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                throw new Error('저장 공간이 부족합니다. 일부 프로젝트를 삭제해주세요.');
            }
            throw e;
        }
        return project;
    },

    deleteProject: async (projectId) => {
        const projects = await localStorageAdapter.getProjects();
        const updatedProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('my_projects', JSON.stringify(updatedProjects));
        return true;
    },

    // Published Content
    getPublishedContent: async (uuid) => {
        const publishedContent = JSON.parse(localStorage.getItem('published_content') || '{}');
        return publishedContent[uuid] || null;
    },

    publishContent: async (uuid, data) => {
        try {
            const publishedContent = JSON.parse(localStorage.getItem('published_content') || '{}');
            publishedContent[uuid] = data;
            localStorage.setItem('published_content', JSON.stringify(publishedContent));
            return data;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                throw new Error('이미지가 너무 커서 게시할 수 없습니다. 이미지 크기를 줄이거나 개수를 줄여주세요.');
            }
            throw e;
        }
    }
};
