-- ============================================
-- Reviews & Ratings System Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per buyer per listing
  UNIQUE(listing_id, reviewer_id)
);

-- 2. Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- 3. Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Anyone can view reviews (public)
CREATE POLICY "Reviews are publicly viewable"
  ON reviews FOR SELECT
  USING (true);

-- Only authenticated users who purchased the listing can create reviews
CREATE POLICY "Buyers can create reviews for purchased listings"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM purchases
      WHERE purchases.buyer_id = auth.uid()
      AND purchases.listing_id = reviews.listing_id
      AND purchases.status = 'completed'
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- 5. Add a read column to messages if it doesn't exist (for notification badges)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'read'
  ) THEN
    ALTER TABLE messages ADD COLUMN read BOOLEAN DEFAULT false;
    CREATE INDEX idx_messages_read ON messages(read) WHERE read = false;
  END IF;
END $$;

-- 6. Create index for unread message count queries
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread
  ON messages(receiver_id)
  WHERE read = false;
