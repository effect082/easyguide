import { supabaseAdapter } from './src/services/supabaseAdapter.js';

async function testConnection() {
    console.log('Testing Supabase connection...');
    try {
        const projects = await supabaseAdapter.getProjects();
        console.log('Successfully connected!');
        console.log(`Found ${projects.length} projects.`);
        console.log('Projects:', JSON.stringify(projects, null, 2));
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

testConnection();
