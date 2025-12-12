
// Airtable Configuration
// Airtable Configuration
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// Helper to make requests
const airtableRequest = async (tableName, method = 'GET', body = null) => {
    if (AIRTABLE_API_KEY === 'YOUR_AIRTABLE_PAT_HERE' || AIRTABLE_BASE_ID === 'YOUR_AIRTABLE_BASE_ID_HERE') {
        throw new Error('Airtable credentials are not configured in src/services/airtableAdapter.js');
    }

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}/${tableName}`, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Airtable Error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
};

export const airtableAdapter = {
    // Projects
    getProjects: async () => {
        try {
            // Note: Airtable returns records in pages (100 per page). 
            // For simplicity, we're just fetching the first page here. 
            // For production, you should handle pagination using the 'offset' parameter.
            const data = await airtableRequest('Projects?sort%5B0%5D%5Bfield%5D=updatedAt&sort%5B0%5D%5Bdirection%5D=desc');

            return data.records.map(record => ({
                id: record.fields.id,
                _recordId: record.id, // Internal Airtable ID, needed for updates/deletes
                title: record.fields.title,
                category: record.fields.category,
                type: record.fields.type,
                password: record.fields.password,
                author: record.fields.author,
                blocks: record.fields.blocks ? JSON.parse(record.fields.blocks) : [],
                createdAt: record.fields.createdAt,
                updatedAt: record.fields.updatedAt
            }));
        } catch (error) {
            console.error('Failed to fetch projects from Airtable:', error);
            throw error;
        }
    },

    saveProject: async (project) => {
        try {
            // Check if project exists to decide between create (POST) or update (PATCH)
            // We need to find the Airtable Record ID first.
            // In a real app, we would store the Airtable Record ID in the state.
            // Here, we'll search for it by our custom 'id' field.

            const searchResponse = await airtableRequest(`Projects?filterByFormula={id}='${project.id}'`);
            const existingRecord = searchResponse.records[0];

            const fields = {
                id: project.id,
                title: project.title,
                category: project.category,
                type: project.type,
                password: project.password,
                author: project.author,
                blocks: JSON.stringify(project.blocks), // Airtable doesn't support JSON type natively in API same as Supabase, usually stored as text or JSON field
                updatedAt: new Date().toISOString()
            };

            if (existingRecord) {
                // Update
                const response = await airtableRequest(`Projects/${existingRecord.id}`, 'PATCH', { fields });
                return { ...project, _recordId: response.id };
            } else {
                // Create
                fields.createdAt = new Date().toISOString();
                const response = await airtableRequest('Projects', 'POST', { fields });
                return { ...project, _recordId: response.id };
            }
        } catch (error) {
            console.error('Failed to save project to Airtable:', error);
            throw error;
        }
    },

    deleteProject: async (projectId) => {
        try {
            // 1. Find the project record ID
            const searchResponse = await airtableRequest(`Projects?filterByFormula={id}='${projectId}'`);
            const projectRecord = searchResponse.records[0];

            if (!projectRecord) {
                console.warn('Project not found for deletion');
                return false;
            }

            // 2. Find associated published content to delete (Optional but recommended)
            // Airtable API rate limits are strict (5 req/sec), so be careful with bulk deletes.
            // We will skip deleting published content for now to keep it simple and safe, 
            // or we would need to implement a loop similar to the Supabase adapter.

            // 3. Delete the project
            await airtableRequest(`Projects/${projectRecord.id}`, 'DELETE');
            return true;
        } catch (error) {
            console.error('Failed to delete project from Airtable:', error);
            throw error;
        }
    },

    // Published Content
    getPublishedContent: async (uuid) => {
        try {
            const searchResponse = await airtableRequest(`PublishedContents?filterByFormula={id}='${uuid}'`);
            const record = searchResponse.records[0];

            if (!record) return null;

            return {
                id: record.fields.id,
                projectId: record.fields.projectId,
                blocks: record.fields.blocks ? JSON.parse(record.fields.blocks) : [],
                metadata: record.fields.metadata ? JSON.parse(record.fields.metadata) : {},
                publishedAt: record.fields.publishedAt
            };
        } catch (error) {
            console.error('Failed to fetch published content from Airtable:', error);
            return null;
        }
    },

    publishContent: async (uuid, data) => {
        try {
            const searchResponse = await airtableRequest(`PublishedContents?filterByFormula={id}='${uuid}'`);
            const existingRecord = searchResponse.records[0];

            const fields = {
                id: uuid,
                projectId: data.projectId,
                blocks: JSON.stringify(data.blocks),
                metadata: JSON.stringify(data.metadata),
                publishedAt: data.publishedAt
            };

            if (existingRecord) {
                await airtableRequest(`PublishedContents/${existingRecord.id}`, 'PATCH', { fields });
            } else {
                await airtableRequest('PublishedContents', 'POST', { fields });
            }
            return data;
        } catch (error) {
            console.error('Failed to publish content to Airtable:', error);
            throw error;
        }
    }
};
