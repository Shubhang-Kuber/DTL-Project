# Terminal Instructions - DTL Dashboard 2.0 (React)

## Prerequisites Check

Before starting, verify Node.js and npm are installed:

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version (should be 7+)
npm --version
```

If not installed, download from https://nodejs.org/

---

## Step-by-Step Setup & Run

### Step 1: Navigate to Dashboard Directory

```bash
cd "c:\Shubhang Kuber\Engineering 2024-2028\2nd Year All Docs\3rd Semester\DTL\DTL-Project\dashboard-2"
```

**What this does:** Changes your terminal location to the dashboard folder.

---

### Step 2: Install Dependencies

```bash
npm install
```

**What this does:**
- Reads `package.json`
- Downloads all required packages (React, Vite, Tailwind, Recharts, Framer Motion)
- Creates `node_modules/` folder
- Generates `package-lock.json` for version consistency

**Expected output:**
```
added 500+ packages in ~30-45 seconds
```

---

### Step 3: Start Development Server

```bash
npm run dev
```

**What this does:**
- Starts Vite development server on http://localhost:3000
- Enables hot module reload (changes update instantly)
- Opens browser automatically (or visit manually)

**Expected output:**
```
  VITE v5.0.0  ready in 200 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**The dashboard is now running!**

- Use the dashboard: Fill out the form → see risk assessment
- Press `Ctrl+C` to stop the server

---

### Step 4: Create Production Build (Optional)

When ready to deploy, create optimized build:

```bash
npm run build
```

**What this does:**
- Minifies JavaScript (reduces file size)
- Optimizes CSS and images
- Creates `dist/` folder with production assets
- Generates source maps for debugging

**Output:**
```
dist/index.html               0.45 kB
dist/assets/index-abc123.js   145.32 kB
dist/assets/index-def456.css  12.15 kB
```

---

### Step 5: Preview Production Build (Optional)

Test production build locally:

```bash
npm run preview
```

**What this does:**
- Starts server serving optimized `dist/` files
- Shows how app will perform in production

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm install` | Install/update dependencies |
| `npm install <package-name>` | Add new package |
| `npm update` | Update all packages to latest versions |

---

## Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Use a different port
npm run dev -- --port 3001
```

Then visit http://localhost:3001/

---

### Issue: "command not found: npm"

Node.js/npm not installed. Download from:
https://nodejs.org/ (LTS version recommended)

---

### Issue: "npm ERR! code EACCES"

Permission error. Try:

```bash
# On Windows (if admin required)
npm install --global npm@latest
```

---

### Issue: Styles not loading

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

## Windows Terminal Specific Tips

If using PowerShell, you may need:

```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Full Setup Example (Copy-Paste)

```bash
# Navigate to project
cd "c:\Shubhang Kuber\Engineering 2024-2028\2nd Year All Docs\3rd Semester\DTL\DTL-Project\dashboard-2"

# Install dependencies
npm install

# Start development server
npm run dev
```

Then:
1. Browser opens automatically to http://localhost:3000
2. Fill out the assessment form
3. See your risk score and recommendations
4. Press Ctrl+C in terminal to stop

---

## For Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Create account at https://netlify.com
# Connect GitHub repo or upload dist/ folder

npm run build
# Upload dist/ folder via Netlify drag-and-drop
```

---

## How the Dashboard Works

1. **User fills form** (Screen 1) → Responses collected
2. **System processes** → Scoring engine applies direction-aware logic
3. **Risk calculated** → Low/Medium/High classification
4. **Recommendations generated** → Personalized support suggestions
5. **Results displayed** → Screens 2–4 with visualizations

**Key: Direction-aware scoring ensures**
- Worst answers → HIGH RISK 🔴
- Best answers → LOW RISK 🟢

---

## Quick Testing

After server starts (Step 3):

1. Go to http://localhost:3000
2. Answer all questions honestly
3. Click "Analyze My Risk"
4. See your risk badge and recommendations
5. Use navigation buttons to explore all screens

---

## Need Help?

- Check browser console (F12) for errors
- Ensure you're in the correct directory
- Verify Node.js is properly installed
- Review README.md in dashboard-2 folder

---

**You're all set! Happy analyzing! 🚀**
