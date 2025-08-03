# Arcade World 🎮

A comprehensive arcade game collection platform with virtual currency, tickets, prizes, challenges, and user progression systems. Built with Next.js 14+ and Supabase.

## Features

- 🎯 **Authentication System** - Email/password, Google OAuth, and anonymous accounts
- 🏆 **Progression System** - Points, tickets, levels, and experience tracking  
- 🎮 **Game Collection** - Multiple arcade games with different modes
- 🎪 **Prize System** - Redeem tickets for virtual prizes
- 👤 **User Profiles** - Customizable profiles with username validation
- 🌙 **Theme Support** - Dark/light theme with user preferences
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (Supabase)
- **State Management:** Zustand
- **Styling:** TailwindCSS 4.0
- **Forms:** React Hook Form with Zod validation
- **Icons:** Phosphor Icons

## Getting Started

### Prerequisites

1. Node.js 20 LTS or later
2. A Supabase account and project

### Setup

1. Clone the repository:
```bash
git clone https://github.com/SirPenguin555/Arcade-World.git
cd Arcade-World
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Set up the database schema (see Database Setup below)

4. Configure environment variables:
   - Copy `.env.local` and update with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  username TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 100,
  tickets INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  unlocked_arcades TEXT[] DEFAULT ARRAY['classic'],
  unlocked_modes TEXT[] DEFAULT ARRAY['freeplay', 'challenges'],
  preferences JSONB DEFAULT '{"theme": "dark", "soundEnabled": true, "musicEnabled": true, "notifications": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  account_linked_at TIMESTAMPTZ
);

-- Create usernames table for uniqueness
CREATE TABLE usernames (
  username TEXT PRIMARY KEY,
  original_username TEXT NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_stats table for detailed statistics
CREATE TABLE user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  stat_name TEXT NOT NULL,
  stat_value BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stat_name)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for usernames
CREATE POLICY "Anyone can view usernames" ON usernames
  FOR SELECT TO authenticated;

CREATE POLICY "Users can insert own username" ON usernames
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR ALL USING (auth.uid() = user_id);
```

### OAuth Setup (Optional)

To enable Google authentication:

1. Go to your Supabase project settings → Authentication → Providers
2. Enable Google provider
3. Add your OAuth credentials from Google Cloud Console
4. Set the redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── auth/           # Authentication pages
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── auth/          # Authentication components
│   └── ui/            # UI components
├── lib/               # Utilities and configuration
│   ├── supabase/      # Supabase client and services
│   └── utils.ts       # Helper functions
├── stores/            # Zustand stores
├── types/             # TypeScript type definitions
└── styles/            # Additional styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
