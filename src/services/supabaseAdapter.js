import { supabase } from '../lib/supabase.js';

export const supabaseAdapter = {
    // Projects
    getProjects: async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;

        return data.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            type: p.type,
            password: p.password, // Note: In a real app, passwords shouldn't be stored plain text
            author: p.author,
            blocks: p.blocks || [],
            createdAt: p.created_at,
            updatedAt: p.updated_at
        }));
    },

    saveProject: async (project) => {
        if (!supabase) throw new Error('Supabase not configured');

        const dbProject = {
            id: project.id,
            title: project.title,
            category: project.category,
            type: project.type,
            password: project.password,
            author: project.author,
            blocks: project.blocks,
            updated_at: new Date().toISOString()
        };

        // Check if exists to decide insert or update (upsert)
        const { error } = await supabase
            .from('projects')
            .upsert(dbProject)
            .select()
            .single();

        if (error) throw error;
        return project;
    },

    deleteProject: async (projectId) => {
        if (!supabase) throw new Error('Supabase not configured');

        // Step 1: Find associated published content IDs
        const { data: publishedContents, error: fetchError } = await supabase
            .from('published_contents')
            .select('id')
            .eq('project_id', projectId);

        if (fetchError) {
            console.warn('Failed to fetch published contents for deletion:', fetchError);
        }

        // Step 2: Delete published contents in batches
        if (publishedContents && publishedContents.length > 0) {
            const idsToDelete = publishedContents.map(pc => pc.id);
            const batchSize = 5; // Delete 5 at a time to be safe

            for (let i = 0; i < idsToDelete.length; i += batchSize) {
                const batch = idsToDelete.slice(i, i + batchSize);
                try {
                    const { error: deleteError } = await supabase
                        .from('published_contents')
                        .delete()
                        .in('id', batch);

                    if (deleteError) {
                        console.warn('Failed to delete batch:', deleteError);
                    }
                } catch (e) {
                    console.warn('Exception deleting batch:', e);
                }
            }
        }

        // Step 3: Delete the project
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw error;
        return true;
    },

    // Published Content
    getPublishedContent: async (uuid) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('published_contents')
            .select('*')
            .eq('id', uuid)
            .single();

        if (error) return null;

        return {
            id: data.id,
            projectId: data.project_id,
            blocks: data.blocks,
            metadata: data.metadata,
            publishedAt: data.published_at
        };
    },

    publishContent: async (uuid, data) => {
        if (!supabase) throw new Error('Supabase not configured');

        const dbContent = {
            id: uuid,
            project_id: data.projectId,
            blocks: data.blocks,
            metadata: data.metadata,
            published_at: data.publishedAt
        };

        const { error } = await supabase
            .from('published_contents')
            .upsert(dbContent);

        if (error) throw error;
        return data;
    }
};
