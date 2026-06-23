-- AmkyawDev Recap Database Schema
-- PostgreSQL / Neon

-- Users table (synced with Appwrite Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appwrite_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    storage_used BIGINT DEFAULT 0,
    storage_limit BIGINT DEFAULT 10737418240, -- 10GB
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    storage_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    duration INTEGER,
    type VARCHAR(50) DEFAULT 'video',
    thumbnail VARCHAR(500),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subtitles table
CREATE TABLE IF NOT EXISTS subtitles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'en',
    segments JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    openai_key VARCHAR(500),
    gemini_key VARCHAR(500),
    elevenlabs_key VARCHAR(500),
    youtube_token JSONB,
    tiktok_token JSONB,
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Publish History table
CREATE TABLE IF NOT EXISTS publish_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    platform_video_id VARCHAR(255),
    url VARCHAR(500),
    metadata JSONB,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_videos_project_id ON videos(project_id);
CREATE INDEX IF NOT EXISTS idx_videos_type ON videos(type);
CREATE INDEX IF NOT EXISTS idx_subtitles_video_id ON subtitles(video_id);
CREATE INDEX IF NOT EXISTS idx_publish_history_user_id ON publish_history(user_id);
CREATE INDEX IF NOT EXISTS idx_publish_history_platform ON publish_history(platform);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subtitles_updated_at ON subtitles;
CREATE TRIGGER update_subtitles_updated_at BEFORE UPDATE ON subtitles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
