# The Recipe 🍲
Express + MongoDB + plain HTML/CSS/JS. No Lovable code.

## Run it (Windows)
1. Install Node.js (LTS) from nodejs.org.
2. Get a database: either install MongoDB Community Server (it runs on `mongodb://127.0.0.1:27017`), or make a free cluster on MongoDB Atlas and copy its connection string.
3. `.env` is already created for a local MongoDB. Change `JWT_SECRET` if you like.
4. In the VS Code terminal: `npm install` then `npm start`, then open http://localhost:3000. On first run the 4 starter recipes are added to MongoDB.

## Where things are
- `server.js` – API, MongoDB models (User, Recipe), login, favorites, uploads
- `public/app.js` – all pages; put your name in `OWNER` on line 1
- `public/style.css` – colors are at the top (`:root`)
- `public/images/recipes/` – starter photos (matched to recipes in `seed-recipes.json`)
- `public/uploads/` – photos people upload when adding recipes
- New cuisines: use "Add recipe" in the site. Typing a new cuisine name creates it automatically.

## Using your original Lovable photos
The site looks for these files and uses them if they exist (otherwise it shows a built-in look-alike):
- `public/images/bg-light.webp` – light background photo
- `public/images/bg-dark.avif` – dark background photo
- `public/images/logo.jpg` – round chef logo
Copy them from your original project's `public/Images` folder and rename them like above. Optional: paste your GitHub / X links on line 2 of `public/app.js`.

## Admin review
New recipes from users wait as "Pending" until an admin approves them. The admin is the person whose account email equals `ADMIN_EMAIL` in `.env`. Set it to your email, restart the site, then sign up (or log in) with that email. You get **Review** and **My recipes** in the menu. Recipes you add yourself are published immediately.

## Import from a link
On **Add recipe**, paste the link of a recipe page and press *Import from link*. The form is filled in for you (name, ingredients, steps, photo). Check it, add the cuisine if it is empty, then publish. The source website is shown on the recipe page.

## Put it online with Vercel
1. Make a free MongoDB Atlas cluster. Under *Database Access* add a user, and under *Network Access* allow `0.0.0.0/0` (Vercel has changing IPs). Copy the connection string and add a database name, e.g. `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/the-recipe`.
2. Push this folder to a GitHub repository (`.env` is ignored on purpose).
3. On vercel.com choose *Add New → Project*, import the repository, and before deploying add these *Environment Variables*: `MONGODB_URI`, `JWT_SECRET` (long random text), `ADMIN_EMAIL`.
4. Press *Deploy*. Uploaded photos are stored inside MongoDB (max about 4 MB each).

Note: `npm install` (and every Vercel deploy) runs `bundle.js`, which packs `public/` into `static-bundle.json`. If you add images to `public/` and test on your laptop, nothing extra is needed.
