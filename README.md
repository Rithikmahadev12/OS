# Jay's OS Links

A personal link launchpad with user auth and admin controls.

## Deploy on Render

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Click Deploy

That's it! Your OS will be live at your Render URL.

## Passwords

- **Invite password** (to create an account): `tejushasnoaura` or `Jay`
- **Admin access** (Ctrl+X then Y, or Ctrl+Cmd+X then Y on Mac): `messi2be`

## Features

- Sign in / create account with invite password
- Launchpad grid of links (shared for all users)
- Admin panel: add/remove links and users
- Links stored in `db.json` on the server — synced for everyone
