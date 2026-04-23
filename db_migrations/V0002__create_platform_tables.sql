CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  repo_url VARCHAR(500),
  framework VARCHAR(100) DEFAULT 'other',
  domain VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE deployments (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  status VARCHAR(50) DEFAULT 'queued',
  branch VARCHAR(255) DEFAULT 'main',
  commit_sha VARCHAR(64),
  commit_message VARCHAR(500),
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  finished_at TIMESTAMP
);
