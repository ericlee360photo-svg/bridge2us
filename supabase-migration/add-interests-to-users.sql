-- Add interests column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Add index for interests array for better query performance
CREATE INDEX IF NOT EXISTS idx_users_interests ON users USING GIN (interests);

-- Add comment to document the interests field
COMMENT ON COLUMN users.interests IS 'Array of interest IDs selected by the user during signup';

-- Example of how to query users by interests:
-- SELECT * FROM users WHERE 'music' = ANY(interests);
-- SELECT * FROM users WHERE interests && ARRAY['music', 'travel', 'cooking'];

-- Example of how to find users with similar interests:
-- SELECT u1.id, u2.id, array_length(array(
--   SELECT unnest(u1.interests) INTERSECT SELECT unnest(u2.interests)
-- ), 1) as common_interests
-- FROM users u1, users u2 
-- WHERE u1.id != u2.id;
