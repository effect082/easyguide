
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyTNRpTup97ipSS2ceSjOC9lkekTXMBBxi_QZpPHheZ4Mn_6yVV7fOtmGTHrRZjJHcM/exec";

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
        // Fix for duplication: Check if project exists, delete it, then save new version
        try {
            // 1. Get all projects to check for existence
            // 1. Get all projects to check for existence
            const existingProjects = await googleSheetsAdapter.getProjects();
            // Use loose comparison (String conversion) to find the match
            const existingProject = existingProjects.find(p => String(p.id) === String(project.id));

            // 2. If exists, delete it first using the EXACT ID from the server record
            if (existingProject) {
                console.log(`Project ${project.id} exists. Deleting ID: ${existingProject.id} (type: ${typeof existingProject.id})...`);
                await googleSheetsAdapter.deleteProject(existingProject.id);
            }

            // 3. Save the new version
            const payload = {
                ...project,
                password: `'${project.password}`, // Prepend ' to force Google Sheets to treat as string
                blocks: JSON.stringify(project.blocks)
            };

            const savedProject = await request('saveProject', { project: payload });
            return {
                ...savedProject,
                blocks: JSON.parse(savedProject.blocks)
            };
        } catch (error) {
            console.error('Failed to save project (Delete-then-Save sequence):', error);
            throw error;
        }
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
                blocks: (typeof data.blocks === 'string') ? JSON.parse(data.blocks) : (data.blocks || []),
                metadata: (typeof data.metadata === 'string') ? JSON.parse(data.metadata) : (data.metadata || {})
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