
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

const request = async (action, data = {}) => {
    if (!GOOGLE_SHEETS_URL) {
        throw new Error('Google Sheets URL is not configured');
    }

    // Google Apps Script Web App mostly works via POST with JSON payload
    // use no-cors mode is NOT recommended if we want to read the response.
    // We expect the script to handle CORS (return appropriate headers).
    const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Specific fix for GAS
        },
        body: JSON.stringify({ action, ...data })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Google Sheets API Error: ${response.status} - ${text}`);
    }

    const result = await response.json();
    if (result.status === 'error') {
        throw new Error(result.message);
    }
    return result.data;
};

export const googleSheetsAdapter = {
    // Projects
    getProjects: async () => {
        const data = await request('getProjects');
        return data.map(project => ({
            ...project,
            // Parse JSON strings back to objects
            blocks: project.blocks ? JSON.parse(project.blocks) : [],
        }));
    },

    saveProject: async (project) => {
        // Ensure blocks are stringified before sending if the script expects strings
        // But usually easier to send object and let script stringify, or stringify here.
        // Let's stringify here to be safe and consistent with other adapters.
        const payload = {
            ...project,
            blocks: JSON.stringify(project.blocks)
        };
        const savedProject = await request('saveProject', { project: payload });
        return {
            ...savedProject,
            blocks: JSON.parse(savedProject.blocks)
        };
    },

    deleteProject: async (projectId) => {
        await request('deleteProject', { id: projectId });
        return true;
    },

    // Published Content
    getPublishedContent: async (uuid) => {
        try {
            const data = await request('getPublishedContent', { id: uuid });
            if (!data) return null;
            return {
                ...data,
                blocks: data.blocks ? JSON.parse(data.blocks) : [],
                metadata: data.metadata ? JSON.parse(data.metadata) : {}
            };
        } catch (error) {
            console.warn('Faield to get published content', error);
            return null;
        }
    },

    publishContent: async (uuid, data) => {
        const payload = {
            id: uuid,
            projectId: data.projectId,
            blocks: JSON.stringify(data.blocks),
            metadata: JSON.stringify(data.metadata),
            publishedAt: data.publishedAt
        };

        await request('publishContent', { content: payload });
        return data; // Return original data as confirmation
    }
};
