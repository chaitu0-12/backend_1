-- Add 'used' column to otp_tokens table
ALTER TABLE otp_tokens 
ADD COLUMN used BOOLEAN NOT NULL DEFAULT FALSE;