-- Migration for adding new user profile fields
-- Created by the user management system

-- Add new fields to User table
ALTER TABLE User ADD COLUMN displayName TEXT NOT NULL DEFAULT '';
ALTER TABLE User ADD COLUMN nickname TEXT NOT NULL DEFAULT '';
ALTER TABLE User ADD COLUMN avatar TEXT;
ALTER TABLE User ADD COLUMN phone TEXT;
ALTER TABLE User ADD COLUMN bio TEXT;

-- Update existing users to have default values
-- If fullName exists, populate displayName and nickname
UPDATE User 
SET 
  displayName = CASE WHEN fullName IS NOT NULL AND fullName != '' THEN fullName ELSE 'کاربر ' || id END,
  nickname = CASE WHEN fullName IS NOT NULL AND fullName != '' THEN fullName ELSE 'کاربر' || id END
WHERE displayName = '';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_nickname ON User(nickname);
CREATE INDEX IF NOT EXISTS idx_user_email ON User(email);

-- Update User model (for reference)
-- Added fields:
-- - displayName: String (main name, admin-only)
-- - nickname: String (user's preferred name, user-editable)
-- - avatar: String? (profile image URL)
-- - phone: String? (user phone number)
-- - bio: String? (user bio/description)