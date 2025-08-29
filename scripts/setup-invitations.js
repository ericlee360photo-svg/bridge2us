/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupInvitations() {
  try {
    console.log('Setting up partner invitation system...');

    // Create partner_invitations table
    console.log('Creating partner_invitations table...');
    const { error: invitationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS partner_invitations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          invitation_token TEXT UNIQUE NOT NULL,
          inviter_id TEXT NOT NULL,
          inviter_name TEXT NOT NULL,
          inviter_email TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (invitationsError) {
      console.error('Error creating partner_invitations table:', invitationsError);
    } else {
      console.log('✅ partner_invitations table created');
    }

    // Create partnerships table
    console.log('Creating partnerships table...');
    const { error: partnershipsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS partnerships (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user1_id TEXT NOT NULL,
          user2_id TEXT NOT NULL,
          user1_name TEXT NOT NULL,
          user2_name TEXT NOT NULL,
          user1_email TEXT NOT NULL,
          user2_email TEXT NOT NULL,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user1_id, user2_id)
        );
      `
    });

    if (partnershipsError) {
      console.error('Error creating partnerships table:', partnershipsError);
    } else {
      console.log('✅ partnerships table created');
    }

    // Create indexes for better performance
    console.log('Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_partner_invitations_token ON partner_invitations(invitation_token);
        CREATE INDEX IF NOT EXISTS idx_partner_invitations_status ON partner_invitations(status);
        CREATE INDEX IF NOT EXISTS idx_partnerships_user1 ON partnerships(user1_id);
        CREATE INDEX IF NOT EXISTS idx_partnerships_user2 ON partnerships(user2_id);
      `
    });

    if (indexError) {
      console.error('Error creating indexes:', indexError);
    } else {
      console.log('✅ Indexes created');
    }

    // Set up RLS policies
    console.log('Setting up RLS policies...');
    
    // Enable RLS on tables
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE partner_invitations ENABLE ROW LEVEL SECURITY;
        ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
      `
    });

    // Policies for partner_invitations
    const { error: invitationsPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow authenticated users to create invitations" ON partner_invitations
        FOR INSERT TO authenticated WITH CHECK (true);
        
        CREATE POLICY "Allow public to read invitations by token" ON partner_invitations
        FOR SELECT TO anon USING (true);
        
        CREATE POLICY "Allow authenticated users to update their invitations" ON partner_invitations
        FOR UPDATE TO authenticated USING (inviter_id = auth.uid()::text);
      `
    });

    if (invitationsPolicyError) {
      console.error('Error creating invitation policies:', invitationsPolicyError);
    } else {
      console.log('✅ Invitation policies created');
    }

    // Policies for partnerships
    const { error: partnershipsPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow authenticated users to create partnerships" ON partnerships
        FOR INSERT TO authenticated WITH CHECK (true);
        
        CREATE POLICY "Allow users to read their partnerships" ON partnerships
        FOR SELECT TO authenticated USING (user1_id = auth.uid()::text OR user2_id = auth.uid()::text);
        
        CREATE POLICY "Allow users to update their partnerships" ON partnerships
        FOR UPDATE TO authenticated USING (user1_id = auth.uid()::text OR user2_id = auth.uid()::text);
      `
    });

    if (partnershipsPolicyError) {
      console.error('Error creating partnership policies:', partnershipsPolicyError);
    } else {
      console.log('✅ Partnership policies created');
    }

    console.log('🎉 Partner invitation system setup complete!');
    console.log('You can now generate magic links and link partner accounts.');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupInvitations();
