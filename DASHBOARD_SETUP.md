# Portfolio dashboard

The dashboard is at `https://donartduraku.netlify.app/admin/login`. Sign in with the Firebase account that already has an `admins/{your-user-uid}` document in project `donartduraku-11712`.

## First login after this update

1. Open **Dashboard** and click **Import published portfolio**. This copies the recovered profile, hero, 13 projects, career, education, services, skills, process, social links, and settings into Firestore in one batch. It runs only if the portfolio collections are empty, so it will not overwrite edits.
2. Open **Projects** to edit, add, unpublish, or delete projects. Use **Media Library** to upload images or videos, then choose them in a project. The eight old local video files were unavailable; upload them and set each as its project's main video.
3. Use **Profile**, **Hero**, **Career**, **Education**, **Services**, **Skills**, **Process**, **Social Links**, **Site Settings**, **Website Text**, and **SEO** for the rest of the public site. Changes are visible on the public page after it reloads.

The public site continues to show the saved published snapshot until the import. After import, Firestore becomes the source of truth. Uploads use the Cloudinary cloud and unsigned upload preset already configured in Netlify. The current upload limit is 100 MB per file.

## Media deletion

**Remove** in Media Library removes the file's references from projects, the hero, profile, settings, and galleries, then removes its library entry. The stored Cloudinary file remains in Cloudinary. Permanent deletion there requires access to the Cloudinary account's API credentials or a manual deletion in Cloudinary.

## Firebase rules

The dashboard's import and edits require Firestore rules that permit signed-in users listed in `admins/{uid}` to write. [firestore.rules](firestore.rules) is the intended rule set for this site. In Firebase Console, review the current Firestore rules, merge any other rules your project needs, and publish the resulting rules. The file is not deployed by Netlify.

Public visitors can read published portfolio records and submit contact messages. Only administrators can read messages or manage portfolio and media metadata.
