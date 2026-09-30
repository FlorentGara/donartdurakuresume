# Donart Duraku Portfolio CMS

A complete content-managed portfolio/CV system for Donart Duraku. Built with React, Vite, Tailwind CSS, and Supabase.

## System Architecture

1. **Public Website (`/`)**: Displays the complete portfolio. Reads published data from Supabase.
2. **Admin Dashboard (`/admin`)**: A secure CMS where the authenticated administrator can control all website content (projects, career, education, skills, services, hero settings, SEO, and contact messages). 

## Setup Instructions

For the current move to the Supabase project you own, follow [NEW_SUPABASE_SETUP.md](NEW_SUPABASE_SETUP.md). It covers the database, admin account, Netlify variables, and deployment in order.

For local development, copy `.env.example` to `.env`, enter the same project's URL and publishable key, then run `npm install` and `npm run dev`. `.env` is ignored by Git. The admin login is at `http://localhost:5173/admin/login`.

---

## Features
* **Authentication**: Secure admin login using Supabase Auth.
* **Content Management**: Manage Profile, Hero, Career, Education, Projects, Services, Skills, Process, and Contact Information.
* **Media Library**: Upload and manage images, videos, and documents (like CVs) via Supabase Storage.
* **SEO Settings**: Control global SEO and Open Graph metadata directly from the dashboard.
* **Live Updates**: All changes made in the dashboard are immediately reflected on the public website.

 
