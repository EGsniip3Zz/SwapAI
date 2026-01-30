# SwapAI - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (optional, for version control)

---

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose a name (e.g., "swapai")
4. Set a database password (save this!)
5. Choose a region close to you
6. Click "Create new project"

### Set Up the Database Schema

Go to the **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT DEFAULT 'other',
  emoji TEXT DEFAULT '🤖',
  price_type TEXT DEFAULT 'one-time' CHECK (price_type IN ('one-time', 'monthly', 'free', 'contact')),
  price DECIMAL(10, 2) DEFAULT 0,
  website_url TEXT,
  demo_url TEXT,
  docs_url TEXT,
  image_url TEXT,
  features TEXT[],
  tech_stack TEXT[],
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  rating DECIMAL(2, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Listings policies
CREATE POLICY "Approved listings are viewable by everyone"
  ON listings FOR SELECT
  USING (status = 'approved' OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert their own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Admins can do everything with listings"
  ON listings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
```

### Get Your API Keys

1. Go to **Project Settings** > **API**
2. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Copy your **anon public** key

---

## 2. Project Setup

### Install Dependencies

```bash
cd swapai-app
npm install
```

### Configure Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace with your actual Supabase credentials.

### Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 3. Create Your Admin Account

1. Go to `http://localhost:5173/signup`
2. Create an account with your email
3. Go to your Supabase dashboard > **Table Editor** > **profiles**
4. Find your user and change the `role` to `admin`
5. Log out and log back in — you'll now see the Admin link in the navbar

---

## 4. Deploy to Production

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Option B: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Add environment variables in Site Settings
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy!

---

## 5. Supabase Auth Settings (Important!)

In your Supabase dashboard, go to **Authentication** > **URL Configuration**:

1. **Site URL**: Set to your production URL (e.g., `https://swapai.vercel.app`)
2. **Redirect URLs**: Add:
   - `http://localhost:5173/**` (for local dev)
   - `https://your-production-url.com/**` (for production)

---

## Features Overview

### For Users
- **Sign up / Log in** — Email/password authentication
- **Browse Marketplace** — Filter by category, price, search
- **View Listings** — Full details, demo links, documentation
- **Support** — FAQ and email contact

### For Sellers
- **List Tools** — Create listings with pricing, links, features
- **Auto-approval** — Listings go live immediately
- **Manage Listings** — Edit or delete your listings

### For Admins
- **Dashboard** — Overview stats
- **Manage Listings** — Approve, reject, delete any listing
- **Manage Users** — Change user roles (buyer/seller/admin)

---

## Customization

### Change Support Email
Edit `src/pages/Support.jsx` and change the `supportEmail` variable.

### Add Payment Integration
For actual transactions, you'll want to integrate Stripe:
1. Create a Stripe account
2. Add Stripe.js to the project
3. Create checkout sessions for purchases
4. Handle webhooks for payment confirmation

### Add Image Uploads
Currently uses URL-based images. To add file uploads:
1. Enable Supabase Storage
2. Create a bucket for listing images
3. Add upload functionality to the seller form

---

## Troubleshooting

### "Invalid API key"
- Make sure your `.env` file has the correct keys
- Restart the dev server after changing `.env`

### "User not found in profiles"
- The trigger might not have fired. Manually insert into profiles table.

### "RLS policy error"
- Check that RLS policies are set up correctly
- Make sure you're authenticated for protected actions

---

## Questions?

Contact support or check the Supabase docs at [supabase.com/docs](https://supabase.com/docs)
