-- Bridge2Us Supabase Schema Migration
-- This file contains the SQL schema to recreate your Prisma models in Supabase

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE relationship_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');
CREATE TYPE meetup_status AS ENUM ('PLANNED', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE invitation_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  timezone VARCHAR DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- OAuth information
  google_id VARCHAR UNIQUE,
  
  -- Profile information
  avatar VARCHAR, -- URL to uploaded profile picture
  bio TEXT,
  
  -- Required profile information
  address VARCHAR, -- Private by default
  country VARCHAR, -- Country code (e.g., "US", "GB", "FR")
  language VARCHAR, -- Language code (e.g., "en", "es", "fr")
  latitude FLOAT, -- GPS latitude for weather and map
  longitude FLOAT, -- GPS longitude for weather and map
  birthday TIMESTAMP WITH TIME ZONE,
  is_address_public BOOLEAN DEFAULT FALSE, -- Only shared with partner if true
  
  -- Schedule information
  wake_up_time VARCHAR, -- Format: "07:00"
  bed_time VARCHAR, -- Format: "23:00"
  work_start_time VARCHAR, -- Format: "09:00"
  work_end_time VARCHAR, -- Format: "17:00"
  gym_time VARCHAR, -- Format: "18:00"
  school_time VARCHAR, -- Format: "08:00"
  
  -- Calendar integration
  google_calendar_id VARCHAR,
  outlook_calendar_id VARCHAR,
  apple_calendar_id VARCHAR,
  calendar_sync_enabled BOOLEAN DEFAULT FALSE,
  
  -- User preferences
  measurement_system VARCHAR DEFAULT 'metric', -- "metric" or "imperial"
  temperature_unit VARCHAR DEFAULT 'celsius', -- "celsius" or "fahrenheit"
  distance_unit VARCHAR DEFAULT 'km', -- "km" or "mi"
  
  -- Email verification
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR,
  email_verification_expires TIMESTAMP WITH TIME ZONE
);

-- Relationships table
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status relationship_status DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relationship details
  relationship_type VARCHAR,
  how_long_together VARCHAR,
  communication_style VARCHAR,
  love_languages TEXT, -- JSON string
  future_plans TEXT,
  
  -- Constraints
  UNIQUE(user1_id, user2_id),
  CHECK(user1_id != user2_id)
);

-- Invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_email VARCHAR NOT NULL,
  token VARCHAR UNIQUE NOT NULL,
  status invitation_status DEFAULT 'PENDING',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetups table
CREATE TABLE meetups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR,
  status meetup_status DEFAULT 'PLANNED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relationship to users
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT FALSE,
  location VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Calendar source
  calendar_source VARCHAR, -- "google", "outlook", "apple", "manual"
  external_event_id VARCHAR, -- ID from external calendar
  
  -- User who owns this event
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_relationships_user1 ON relationships(user1_id);
CREATE INDEX idx_relationships_user2 ON relationships(user2_id);
CREATE INDEX idx_invitations_receiver_email ON invitations(receiver_email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_meetups_user1 ON meetups(user1_id);
CREATE INDEX idx_meetups_user2 ON meetups(user2_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_time ON events(start_time);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetups_updated_at BEFORE UPDATE ON meetups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your auth requirements)
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- For now, allow all operations for authenticated users (you can refine these later)
CREATE POLICY "Authenticated users can view relationships" ON relationships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create relationships" ON relationships FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update relationships" ON relationships FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view invitations" ON invitations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create invitations" ON invitations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update invitations" ON invitations FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view meetups" ON meetups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create meetups" ON meetups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update meetups" ON meetups FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create their own events" ON events FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid()::text = user_id::text);
