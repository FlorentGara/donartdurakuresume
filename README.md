# Donart Duraku Portfolio CMS

A complete content-managed portfolio/CV system for Donart Duraku. Built with React, Vite, Tailwind CSS, and Supabase.

## System Architecture

1. **Public Website (`/`)**: Displays the complete portfolio. Reads published data from Supabase.
2. **Admin Dashboard (`/admin`)**: A secure CMS where the authenticated administrator can control all website content (projects, career, education, skills, services, hero settings, SEO, and contact messages). 

## Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once created, obtain your Project URL and anon key from **Project Settings > API**.

### 2. Add Environment Variables
1. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
*(Note: Never commit your `.env` file to version control. It is already included in `.gitignore`.)*

### 3. Run Database Schema
1. Open the Supabase SQL Editor in your Supabase dashboard.
2. Locate the migration files in the `supabase/migrations` folder of this project.
3. Run the SQL files in order (e.g. `20260926101647_001_portfolio_cms_schema.sql`, followed by the others) to set up all required tables, triggers, and Row Level Security (RLS) policies.

### 4. Create Storage Buckets
1. In the Supabase dashboard, navigate to **Storage**.
2. Run the `003_storage_buckets.sql` script or manually create the following public buckets:
   - `images`
   - `videos`
   - `documents`
3. Ensure these buckets are publicly accessible so the website can load media files. The admin dashboard handles uploading files here securely.

### 5. Create First Admin User
1. In the Supabase dashboard, navigate to **Authentication > Users**.
2. Click **Add User** and create an account with your desired admin email and password.
3. This user will be used to log in at `/admin/login`.

### 6. Configure RLS
*Note: The SQL migration scripts already configure Row Level Security (RLS) so that public users can only read published content, and authenticated admins have full CRUD access. No further manual configuration is needed if the scripts ran successfully.*

### 7. Run the Website
To start the development server, run:
```bash
npm install
npm run dev
```
- Open `http://localhost:5173` to see the public portfolio.
- Navigate to `http://localhost:5173/#/admin/login` to access the CMS dashboard.

---

## Features
* **Authentication**: Secure admin login using Supabase Auth.
* **Content Management**: Manage Profile, Hero, Career, Education, Projects, Services, Skills, Process, and Contact Information.
* **Media Library**: Upload and manage images, videos, and documents (like CVs) via Supabase Storage.
* **SEO Settings**: Control global SEO and Open Graph metadata directly from the dashboard.
* **Live Updates**: All changes made in the dashboard are immediately reflected on the public website.
