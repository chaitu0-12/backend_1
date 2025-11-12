-- Add 'updated_at' column to otp_tokens table
ALTER TABLE otp_tokens 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;