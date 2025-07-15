-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('founder', 'investor')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Founder Profiles
CREATE TABLE IF NOT EXISTS founder_profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  linkedin VARCHAR(255),
  -- Add more fields as needed
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Startups
CREATE TABLE IF NOT EXISTS startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(255),
  industry VARCHAR(100),
  stage VARCHAR(50),
  funding_need NUMERIC,
  equity_offered NUMERIC,
  problem TEXT,
  solution TEXT,
  market TEXT,
  team TEXT,
  traction TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Investor Profiles
CREATE TABLE IF NOT EXISTS investor_profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  firm VARCHAR(255),
  website VARCHAR(255),
  bio TEXT,
  check_size VARCHAR(100),
  preferred_sectors TEXT[],
  preferred_geos TEXT[],
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pitches
CREATE TABLE IF NOT EXISTS pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES users(id),
  startup_id UUID REFERENCES startups(id),
  description TEXT,
  funding_ask NUMERIC,
  tags TEXT[],
  pitch_deck_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved Pitches (join table)
CREATE TABLE IF NOT EXISTS saved_pitches (
  investor_id UUID REFERENCES users(id),
  pitch_id UUID REFERENCES pitches(id),
  saved_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (investor_id, pitch_id)
);

-- Files (for uploaded pitch decks/videos)
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  url TEXT NOT NULL,
  type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT NOW()
); 