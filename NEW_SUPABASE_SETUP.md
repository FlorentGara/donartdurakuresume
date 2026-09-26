# Move this website to your Supabase project

The current Netlify site uses an older Supabase project that you cannot access. The project shown in your Supabase account is `yncvnqbbpymshsnaeuke` (FlorentGara's Project). These steps create a fresh CMS there and connect the website to it. Content and uploaded files from the old project cannot be copied without access to that project. The new database starts with the default portfolio content in the seed script.

## 1. Create the CMS database

Open [SQL Editor for your project](https://supabase.com/dashboard/project/yncvnqbbpymshsnaeuke/sql/new). Open each file below in GitHub, copy its **entire** contents into the SQL Editor, and click **Run**. Run one file at a time, in this order:

1. `supabase/migrations/20260926101647_001_portfolio_cms_schema.sql` — tables and public read rules
2. `supabase/migrations/20260926101721_002_seed_default_content.sql` — starter portfolio content
3. `supabase/migrations/20260926101736_003_storage_buckets.sql` — media buckets
4. `supabase/migrations/20260926101800_004_admin_access.sql` — restrict CMS and uploads to named admins

Wait for each file to succeed before running the next one. Do not make the site public with only the first three files applied: the fourth file restricts who can edit it.

## 2. Create your dashboard account

Open [Authentication → Users](https://supabase.com/dashboard/project/yncvnqbbpymshsnaeuke/auth/users). Click **Add user → Create new user**, enter your email and a new password, and create the user. Keep the password private.

In the SQL Editor, run this statement after replacing `YOUR_EMAIL@example.com` with the exact email you used:

```sql
INSERT INTO private.admin_users (user_id)
SELECT id FROM auth.users WHERE lower(email) = lower('YOUR_EMAIL@example.com')
ON CONFLICT (user_id) DO NOTHING;
```

The result should say **1 row affected**. If it says 0, check the email in Authentication → Users and run it again. Only accounts added to `private.admin_users` can use the dashboard.

## 3. Point Netlify to this project

In Netlify, open **Project configuration → Environment variables**. Update both existing variables for the production deploy:

- `VITE_SUPABASE_URL` = `https://yncvnqbbpymshsnaeuke.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = the new project's **publishable key** (`sb_publishable_...`) or legacy **anon** key, from Supabase **Project Settings → API Keys**

Use the key from the same project as the URL. Never use a `service_role` or `sb_secret_...` key in a `VITE_` variable. Set the same values for preview and branch deploys if you use those contexts.

Netlify bakes these values into the frontend at build time. After updating them, go to **Deploys → Trigger deploy → Deploy project** (or push a new commit) and wait for the new production deploy to finish.

## 4. Sign in and check

Open `https://donartduraku.netlify.app/admin/login` and sign in with the email and password from step 2. The hash link `https://donartduraku.netlify.app/#/admin/login` also works.

Check that the public home page shows the starter portfolio and that you can save a small edit in the dashboard. Files uploaded to the old Supabase project will need uploading again from the new dashboard.
