# Venturely Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/venturely
   SUPABASE_URL=https://your-supabase-project-url.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   PORT=4000
   ```

3. Start the server:
   ```bash
   node src/index.js
   ```

## API Endpoints
- `/api/auth/signup` (POST)
- `/api/auth/login` (POST)
- More endpoints coming soon... 