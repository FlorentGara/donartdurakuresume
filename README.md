# Donart Duraku Portfolio CMS

Public portfolio at https://donartduraku.netlify.app/ and editor at https://donartduraku.netlify.app/admin/login.

Built with React and Vite. Firebase Authentication protects the editor; Firestore stores editable portfolio content and contact messages. Media uploads use Cloudinary. The site includes a saved copy of the previously published portfolio until that content is imported into Firestore.

See [DASHBOARD_SETUP.md](DASHBOARD_SETUP.md) for the first import, editing, media handling, and Firestore rules.

For local development, copy `.env.example` to `.env`, supply this Firebase project's client configuration and the Cloudinary cloud name and upload preset, then run `npm ci` and `npm run dev`.
