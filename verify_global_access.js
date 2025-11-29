
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwffvmzxeyhftjtvkpmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZmZ2bXp4ZXloZnRqdHZrcG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjYyMTUsImV4cCI6MjA3OTQwMjIxNX0.uy-BDEiyaOortHwRXuPBM7RTxrfDmz7g0xQvWIMG_io';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyGlobalAccess() {
    console.log("Starting Global Visibility Verification...");

    // 1. Create User A
    const emailA = `testuser${Date.now()}@gmail.com`;
    const password = 'password123';
    const { data: { user: userA }, error: errorA } = await supabase.auth.signUp({
        email: emailA,
        password: password
    });

    if (errorA) {
        console.error("Failed to create User A:", errorA.message);
        return;
    }
    console.log("User A created:", emailA);

    // 2. User A creates a project
    // We need to sign in to get the session for RLS
    await supabase.auth.signInWithPassword({ email: emailA, password });

    const projectId = `test_proj_${Date.now()}`;
    const { error: createError } = await supabase.from('projects').insert({
        id: projectId,
        title: 'User A Project',
        category: '개인', // Personal project
        type: '뉴스레터',
        password: '1234',
        author: 'User A',
        user_id: userA.id,
        updated_at: new Date().toISOString()
    });

    if (createError) {
        console.error("User A failed to create project:", createError.message);
        return;
    }
    console.log("User A created 'Personal' project.");

    await supabase.auth.signOut();

    // 3. Create User B
    const emailB = `testuser${Date.now() + 1}@gmail.com`;
    const { error: errorB } = await supabase.auth.signUp({
        email: emailB,
        password: password
    });

    if (errorB) {
        console.error("Failed to create User B:", errorB.message);
        return;
    }
    console.log("User B created:", emailB);

    // 4. User B tries to fetch User A's project
    await supabase.auth.signInWithPassword({ email: emailB, password });

    const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId);

    if (fetchError) {
        console.error("User B failed to fetch projects:", fetchError.message);
        return;
    }

    if (projects && projects.length > 0) {
        console.log("SUCCESS: User B can see User A's personal project!");
        console.log("Global Visibility Policy is ACTIVE.");
    } else {
        console.error("FAILURE: User B CANNOT see User A's personal project.");
        console.error("Global Visibility Policy is NOT ACTIVE.");
        console.log("Please run the SQL script in Supabase Dashboard.");
    }
}

verifyGlobalAccess();
