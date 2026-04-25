# Growth — Tools for Personal Growth

A small collection of static, in-browser instruments for thinking through goals,
self-assessment, and decisions you keep putting off. No accounts, no tracking,
no save file — state lives only in your current tab.

**Tools included**

1. **SMART Goal** — define a goal as a peak you can see (`smart.html`)
2. **SWOT Analysis** — four quadrants for honest self-assessment (`swot.html`)
3. **Fast & frugal trees** — three or four binary questions in sequence (`trees.html` → `tree-buy-time.html`)

The homepage (`index.html`) is the world-hub.

---

## Run it locally

It's plain static HTML — open `index.html` in a browser, or serve the folder
with any static server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit <http://localhost:8000>.

---

## Deploy to GitHub Pages

This project is a flat folder of static files with no build step, so deployment
is just "push and enable Pages."

### 1 · Create the repo and push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### 2 · Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` · **Folder:** `/ (root)`
3. Click **Save**

After ~1 minute, your site will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

### 3 · Custom domain (optional)

Add a `CNAME` file at the repo root containing your domain (e.g. `growth.example.com`),
then point a `CNAME` DNS record at `<your-username>.github.io`.

---

## Notes

- `.nojekyll` is included so GitHub Pages serves files starting with `_` correctly
  and skips Jekyll processing (we don't need it).
- All asset paths are relative, so the site works at both the repo subpath
  (`/<repo-name>/`) and at a custom domain root.
- The `.jsx` files are loaded inline through Babel's standalone build at runtime —
  there is no compile step.
