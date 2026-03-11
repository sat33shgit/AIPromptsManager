-- Performance indexes for prompts table
CREATE INDEX IF NOT EXISTS idx_prompts_updated_at ON prompts (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts (category);
CREATE INDEX IF NOT EXISTS idx_prompts_share_token ON prompts (share_token);
CREATE INDEX IF NOT EXISTS idx_prompts_use_count ON prompts (use_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_is_public ON prompts (is_public);
