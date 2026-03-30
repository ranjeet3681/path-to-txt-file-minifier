

```markdown
# 📄 File Minifier

> A powerful web application that recursively reads all text-based files from a given folder, minifies their content, and exports everything into a single organized `.txt` file.

Perfect for quickly exporting and sharing your entire codebase in a compact, readable format.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-3.7-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [How It Works](#-how-it-works)
- [Ignore System](#-ignore-system)
  - [By Extension](#1-by-extension)
  - [By Full File Path](#2-by-full-file-path)
  - [By Wildcard Pattern](#3-by-wildcard-pattern)
  - [By Folder Name](#4-by-folder-name)
- [Quick Ignore Chips](#-quick-ignore-chips)
- [Framework Examples](#-framework-examples)
- [Output Format](#-output-format)
- [Terminal Logging](#-terminal-logging)
- [Supported File Types](#-supported-file-types)
- [Minification Engines](#-minification-engines)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Recursive Scanning** | Reads all files and subfolders at any depth level |
| 📦 **Smart Minification** | Dedicated minifiers for HTML, CSS, JS, JSON and more |
| 🚫 **4-Type Ignore System** | Ignore by extension, file path, wildcard pattern, or folder name |
| 🏷️ **Quick Ignore Chips** | One-click toggles for common extensions, patterns, and folders |
| ⏳ **Loading Animation** | Animated spinner inside the submit button during processing |
| 📊 **Detailed Statistics** | File count, folder count, output size, skipped files, ignore rules |
| 🖥️ **Terminal Logging** | Real-time server logs showing each processed file |
| 🎨 **Modern Dark UI** | Glassmorphism design with animated background particles |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile screens |
| 🛡️ **Binary Detection** | Automatically skips binary files (images, fonts, archives) |
| 📄 **Single File Output** | Everything exported into one organized `.txt` file |

---

## 🎬 Demo

### Application Interface

```
┌──────────────────────────────────────────────────────┐
│                 📄 File Minifier                     │
│   Recursively minify all files & subfolders into     │
│              a single TXT export                     │
│                                                      │
│  📁 Folder Path *                                    │
│  ┌──────────────────────────────────────────────┐    │
│  │ D:\my_projects\vegishop                      │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  🚫 Ignore List (Optional)                           │
│  ┌──────────────────────────────────────────────┐    │
│  │ .png, .jpg, *.spec.ts, [node_modules]        │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  📄 Extensions:  .png  .jpg  .zip  .map  ...         │
│  🔍 Patterns:    *.spec.ts  *.test.js  ...           │
│  📁 Folders:     [node_modules]  [dist]  ...         │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │            ⬆️  Minify & Export                │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ✅ Export Successful!                                │
│  Processed 42 file(s) from 12 folder(s)              │
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │  42  │ │  12  │ │125 KB│ │  18  │ │   6  │      │
│  │Files │ │Folder│ │ Size │ │ Skip │ │Rules │      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │
│                                                      │
│  Output: D:\...\vegishop_minified_output.txt         │
└──────────────────────────────────────────────────────┘
```

### Processing State

```
┌──────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐    │
│  │     ◌  Processing Files…             │    │
│  └──────────────────────────────────────┘    │
│  (Button disabled with animated spinner)     │
└──────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
path-to-txt-file-minifier/
│
├── server.js              # Node.js/Express backend server
├── package.json           # Project dependencies & scripts
├── README.md              # Documentation (this file)
│
└── public/                # Frontend static files
    ├── index.html         # Main HTML page
    ├── css/
    │   └── style.css      # Styles (dark theme, animations, responsive)
    └── js/
        └── app.js         # jQuery frontend logic (AJAX, chips, UI)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** installed (version 16 or higher):

```bash
# Check if Node.js is installed
node --version    # Should show v16.x or higher

# Check if npm is installed
npm --version     # Should show 8.x or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/path-to-txt-file-minifier.git
cd path-to-txt-file-minifier
```

**2. Install dependencies**

```bash
npm install
```

This installs:
- `express` - Web server framework
- `html-minifier-terser` - HTML minification
- `clean-css` - CSS minification
- `terser` - JavaScript minification

### Running the App

```bash
npm start
```

You will see:

```
🚀 File Minifier is running at http://localhost:3000
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## ⚙️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        WORKFLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1 │ User enters a folder path                         │
│         │ Example: D:\my_projects\vegishop                  │
│         │                                                   │
│  Step 2 │ User adds ignore rules (optional)                 │
│         │ Example: .png, .jpg, *.spec.ts, [node_modules]    │
│         │                                                   │
│  Step 3 │ Clicks "Minify & Export"                          │
│         │ → Button shows spinner, disables click            │
│         │                                                   │
│  Step 4 │ Server recursively walks ALL subfolders           │
│         │ → Skips ignored files/folders/patterns             │
│         │ → Skips binary files automatically                │
│         │                                                   │
│  Step 5 │ Each text file is minified using the              │
│         │ appropriate engine (HTML/CSS/JS/JSON/basic)       │
│         │                                                   │
│  Step 6 │ A single .txt file is created with                │
│         │ every file's path + minified content              │
│         │                                                   │
│  Step 7 │ Results displayed with statistics                 │
│         │ → File count, folder count, size, skipped         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚫 Ignore System

The app supports **4 types** of ignore rules entered as a comma-separated list in the ignore field:

### 1. By Extension

Prefix with a dot (`.`) to ignore all files with that extension across all subfolders.

```
.png, .jpg, .zip, .pdf, .map, .woff2
```

| Input | What Gets Ignored |
|-------|-------------------|
| `.png` | All `.png` files in all subfolders |
| `.zip` | All `.zip` files in all subfolders |
| `.map` | All `.map` source map files |
| `.lock` | All lock files (`package-lock.json`, `yarn.lock`, etc.) |

---

### 2. By Full File Path

Provide the complete absolute path to ignore one specific file.

```
D:\my_projects\vegishop\privacy.html
```

| Input | What Gets Ignored |
|-------|-------------------|
| `D:\my_projects\vegishop\privacy.html` | Only this exact file |
| `D:\my_projects\vegishop\js\secret.js` | Only this exact file |

---

### 3. By Wildcard Pattern

Use `*` (any characters) and `?` (single character) to match file name patterns.

```
*.spec.ts, *.test.js, *.min.css, *.d.ts
```

| Pattern | Files It Matches |
|---------|-----------------|
| `*.spec.ts` | `app.component.spec.ts`, `auth.guard.spec.ts`, `user.service.spec.ts` |
| `*.spec.js` | `app.component.spec.js`, `utils.spec.js` |
| `*.test.ts` | `api.test.ts`, `helpers.test.ts` |
| `*.test.js` | `utils.test.js`, `math.test.js` |
| `*.test.tsx` | `Button.test.tsx`, `App.test.tsx` |
| `*.test.jsx` | `Component.test.jsx`, `Header.test.jsx` |
| `*.stories.tsx` | `Button.stories.tsx`, `Card.stories.tsx` |
| `*.min.js` | `jquery.min.js`, `bootstrap.min.js` |
| `*.min.css` | `bootstrap.min.css`, `style.min.css` |
| `*.d.ts` | `index.d.ts`, `global.d.ts` |
| `test_*` | `test_helper.py`, `test_utils.js` |
| `*.stories.*` | `Button.stories.tsx`, `Card.stories.js` |

---

### 4. By Folder Name

Wrap folder names in square brackets `[ ]` to skip entire directories and all their contents.

```
[node_modules], [dist], [build], [.angular], [vendor]
```

| Input | What Gets Ignored |
|-------|-------------------|
| `[node_modules]` | Entire `node_modules` folder and everything inside |
| `[dist]` | Entire `dist` folder and all its contents |
| `[build]` | Entire `build` folder and all its contents |
| `[vendor]` | Entire `vendor` folder and all its contents |
| `[.angular]` | Angular cache folder |
| `[.vscode]` | VS Code settings folder |
| `[coverage]` | Test coverage reports folder |
| `[e2e]` | End-to-end test folder |

#### Default Ignored Folders

These folders are **always** skipped automatically (no need to add them):

| Folder | Reason |
|--------|--------|
| `.git` | Git version control internal data |
| `.svn` | SVN version control data |
| `.hg` | Mercurial version control data |
| `__pycache__` | Python compiled bytecode cache |

---

### Combined Ignore Example

```
.png, .jpg, .gif, .ico, .svg, .zip, .map, .lock, .pdf, .woff, .woff2, .ttf, .eot, *.spec.ts, *.spec.js, *.test.js, *.test.ts, *.min.js, *.min.css, *.d.ts, [node_modules], [dist], [build], [.angular], [coverage], [e2e], [.vscode]
```

---

## 🏷️ Quick Ignore Chips

The UI provides **clickable chips** for fast toggling - organized into 3 categories:

### 📄 Extension Chips

```
.png   .jpg   .jpeg   .gif   .svg   .ico   .webp   .zip
.map   .lock  .pdf    .mp4   .woff  .woff2 .ttf    .eot
```

### 🔍 Pattern Chips

```
*.spec.ts    *.spec.js    *.test.ts    *.test.js
*.test.tsx   *.test.jsx   *.stories.tsx
*.min.js     *.min.css    *.d.ts
```

### 📁 Folder Chips

```
[node_modules]    [dist]       [build]     [.next]
[.nuxt]           [vendor]     [bower_components]
[.vscode]         [.idea]      [coverage]
[.cache]          [tmp]        [.angular]  [e2e]
```

**How chips work:**

- **Click** a chip → adds it to the ignore list (highlighted)
- **Click again** → removes it from the ignore list
- **Type manually** in the textarea → chips auto-sync their active state
- Chips and manual entries **coexist** seamlessly

---

## 🎯 Framework Examples

### Angular

```
Folder:  D:\projects\my-angular-app\src
Ignore:  *.spec.ts, *.spec.js, .map, .png, .jpg, .ico, .svg, *.d.ts, [node_modules], [dist], [.angular], [e2e], [coverage]
```

### React

```
Folder:  C:\Users\dev\react-app\src
Ignore:  *.test.js, *.test.tsx, *.test.jsx, *.stories.tsx, .map, .png, .jpg, .svg, [node_modules], [build], [coverage], [.cache]
```

### Vue.js

```
Folder:  D:\projects\vue-app\src
Ignore:  *.spec.js, *.spec.ts, .map, .png, .jpg, [node_modules], [dist], [.nuxt], [coverage]
```

### Next.js

```
Folder:  D:\projects\nextjs-app
Ignore:  *.test.ts, *.test.tsx, .map, .png, .jpg, .svg, .ico, [node_modules], [.next], [out], [coverage]
```

### Static HTML Website

```
Folder:  D:\my_projects\vegishop
Ignore:  .png, .jpg, .jpeg, .gif, .ico, .svg, .webp, .zip, .pdf, .woff, .woff2, .ttf, .eot, .mp4
```

### Python / Django

```
Folder:  D:\projects\django-app
Ignore:  .pyc, .png, .jpg, .sqlite3, [__pycache__], [.venv], [venv], [staticfiles], [media]
```

### Full-Stack Project

```
Folder:  D:\projects\fullstack-app
Ignore:  .png, .jpg, .svg, .ico, .map, .lock, *.spec.ts, *.test.js, *.min.js, *.min.css, *.d.ts, [node_modules], [dist], [build], [.angular], [coverage], [.vscode], [.idea]
```

---

## 📄 Output Format

The generated `.txt` file follows this structure:

```
D:\my_projects\vegishop\cart.html:
<!doctypehtml><html lang=en><meta charset=utf-8><meta content="width=device-width,initial-scale=1"name=viewport>...

========================================================

D:\my_projects\vegishop\css\style.css:
body{font-family:Ubuntu,sans-serif;background-color:#f0f2f5}::-webkit-scrollbar{width:4px}...

========================================================

D:\my_projects\vegishop\js\osahan.js:
!function(){"use strict";var e=document.querySelector(".nav");...}();

========================================================

D:\my_projects\vegishop\vendor\bootstrap\css\bootstrap.min.css:
:root{--blue:#007bff;--indigo:#6610f2;--purple:#6f42c1}...
```

### Format Details

| Element | Description |
|---------|-------------|
| **File path** | Full absolute path followed by a colon `:` |
| **Content** | Minified file content on the next line |
| **Separator** | 56 equal signs `========...` between each file |
| **Sorting** | Files sorted alphabetically within each directory |
| **File name** | `{foldername}_minified_output.txt` |
| **Location** | Saved in the root of the scanned folder |

---

## 🖥️ Terminal Logging

The server provides detailed real-time logs while processing:

```
══════════════════════════════════════════════════════════
📁 Processing: D:\my_projects\vegishop
🚫 Ignore list: .png, .jpg, *.spec.ts, [node_modules]
══════════════════════════════════════════════════════════
  Ignored extensions: .png, .jpg
  Ignored patterns: *.spec.ts
  Ignored folders: .git, .svn, .hg, __pycache__, node_modules
  Ignored files: (none)
──────────────────────────────────────────────────────────
  📂 Entering: D:\my_projects\vegishop\css
  ✅ Processed: D:\my_projects\vegishop\css\style.css
  ✅ Processed: D:\my_projects\vegishop\cart.html
  ✅ Processed: D:\my_projects\vegishop\faq.html
  📂 Entering: D:\my_projects\vegishop\js
  ✅ Processed: D:\my_projects\vegishop\js\osahan.js
  ✅ Processed: D:\my_projects\vegishop\js\rocket-loader.min.js
  📁 Skipping (user ignore): D:\my_projects\vegishop\node_modules
  📂 Entering: D:\my_projects\vegishop\vendor
  📂 Entering: D:\my_projects\vegishop\vendor\bootstrap
  📂 Entering: D:\my_projects\vegishop\vendor\bootstrap\css
  ✅ Processed: ...\vendor\bootstrap\css\bootstrap.min.css
  📂 Entering: D:\my_projects\vegishop\vendor\bootstrap\js
  ✅ Processed: ...\vendor\bootstrap\js\bootstrap.bundle.min.js
  📂 Entering: D:\my_projects\vegishop\vendor\slick
  ✅ Processed: ...\vendor\slick\slick.min.css
  ✅ Processed: ...\vendor\slick\slick.min.js
──────────────────────────────────────────────────────────
  📊 Directories entered: 11
  📊 Directories skipped: 1
  📊 Files processed: 14
  📊 Files skipped: 23
  📊 Files with errors: 0
  ✅ Output: D:\...\vegishop_minified_output.txt (45.23 KB)
══════════════════════════════════════════════════════════
```

---

## 📑 Supported File Types

<details>
<summary><strong>Web Files</strong> (click to expand)</summary>

| Extension | Type |
|-----------|------|
| `.html`, `.htm`, `.xhtml` | HTML |
| `.css`, `.scss`, `.sass`, `.less` | Stylesheets |
| `.js`, `.jsx`, `.mjs`, `.cjs` | JavaScript |
| `.ts`, `.tsx` | TypeScript |
| `.json`, `.jsonc`, `.json5` | JSON |
| `.xml`, `.svg`, `.xsl` | XML |
| `.vue`, `.svelte`, `.astro` | Framework components |

</details>

<details>
<summary><strong>Templates</strong> (click to expand)</summary>

| Extension | Type |
|-----------|------|
| `.ejs`, `.hbs`, `.handlebars` | Template engines |
| `.pug`, `.jade` | Pug templates |
| `.twig`, `.erb` | Server templates |

</details>

<details>
<summary><strong>Config Files</strong> (click to expand)</summary>

| Extension | Type |
|-----------|------|
| `.yaml`, `.yml` | YAML |
| `.toml`, `.ini`, `.cfg`, `.conf` | Config |
| `.env`, `.env.local`, `.env.production` | Environment |
| `.editorconfig`, `.prettierrc`, `.eslintrc`, `.babelrc` | Tool configs |
| `.npmrc`, `.nvmrc` | Node configs |

</details>

<details>
<summary><strong>Programming Languages</strong> (click to expand)</summary>

| Extension | Language |
|-----------|----------|
| `.py` | Python |
| `.rb` | Ruby |
| `.php` | PHP |
| `.java`, `.kt`, `.scala`, `.groovy` | JVM |
| `.c`, `.cpp`, `.h`, `.hpp` | C/C++ |
| `.cs` | C# |
| `.go` | Go |
| `.rs` | Rust |
| `.swift` | Swift |
| `.lua` | Lua |
| `.r`, `.R` | R |
| `.pl`, `.pm` | Perl |

</details>

<details>
<summary><strong>Data & Scripts</strong> (click to expand)</summary>

| Extension | Type |
|-----------|------|
| `.sql` | SQL |
| `.graphql`, `.gql` | GraphQL |
| `.md`, `.markdown`, `.mdx` | Markdown |
| `.csv`, `.tsv` | Data |
| `.sh`, `.bash`, `.bat`, `.cmd`, `.ps1` | Shell scripts |
| `.txt`, `.log` | Plain text |

</details>

<details>
<summary><strong>Auto-Detected Files (no extension)</strong> (click to expand)</summary>

| File | Type |
|------|------|
| `Makefile` | Build file |
| `Dockerfile` | Container |
| `Gemfile`, `Rakefile` | Ruby |
| `LICENSE`, `README` | Docs |
| `CHANGELOG`, `AUTHORS` | Project info |

</details>

<details>
<summary><strong>Auto-Skipped Binary Files</strong> (click to expand)</summary>

| Category | Extensions |
|----------|-----------|
| Images | `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.ico`, `.webp`, `.tiff` |
| Fonts | `.woff`, `.woff2`, `.ttf`, `.eot`, `.otf` |
| Archives | `.zip`, `.rar`, `.7z`, `.gz`, `.tar`, `.bz2` |
| Media | `.mp3`, `.mp4`, `.avi`, `.mkv`, `.mov`, `.wav`, `.flac` |
| Documents | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` |
| Compiled | `.exe`, `.dll`, `.so`, `.pyc`, `.class`, `.o` |

</details>

---

## ⚡ Minification Engines

| File Type | Engine | Optimizations |
|-----------|--------|--------------|
| HTML | [html-minifier-terser](https://github.com/terser/html-minifier-terser) | Remove comments, collapse whitespace, remove redundant attributes, minify inline CSS/JS, remove optional tags, remove attribute quotes |
| CSS | [clean-css](https://github.com/clean-css/clean-css) | Level 2 optimization, merge selectors, shorten colors, remove unused whitespace |
| JS/TS | [terser](https://github.com/terser/terser) | Compress code, remove dead code, tree shaking |
| JSON | Built-in `JSON.stringify` | Remove all whitespace and formatting |
| Others | Basic minifier | Remove `//` and `/* */` comments, collapse whitespace |

> **Fallback:** If any minifier fails on malformed code, the app automatically falls back to the basic whitespace minifier.

---

## 🔧 Configuration

### Change Server Port

Edit `server.js`:

```javascript
const PORT = 3000;  // Change to any available port (e.g., 8080, 5000)
```

### Add Custom Text Extensions

Edit the `TEXT_EXTENSIONS` set in `server.js`:

```javascript
const TEXT_EXTENSIONS = new Set([
  ".myext",
  ".custom",
  // ... existing extensions
]);
```

### Modify Default Ignored Folders

Edit the `DEFAULT_IGNORE_DIRS` set in `server.js`:

```javascript
const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  ".svn",
  ".hg",
  "__pycache__",
  // Add more folders to always ignore
]);
```

### Customize Minification

**HTML:**
```javascript
await htmlMinify(content, {
  collapseWhitespace: true,
  removeComments: true,
  removeAttributeQuotes: true,
  minifyCSS: true,
  minifyJS: true,
});
```

**CSS:**
```javascript
new CleanCSS({ level: 2 }).minify(content);
// level: 1 = basic, level: 2 = advanced optimizations
```

**JavaScript:**
```javascript
await terserMinify(content, {
  compress: true,
  mangle: false,  // Set true for smaller output (renames variables)
});
```

---

## ❓ Troubleshooting

<details>
<summary><strong>"Folder not found" Error</strong></summary>

- Verify the path exists and is spelled correctly
- Use the **full absolute path** (e.g., `D:\projects\myapp`, not `.\myapp`)
- On Windows use `\` or `/` as path separators
- Ensure you have **read permissions** for the folder

</details>

<details>
<summary><strong>"No readable text files found"</strong></summary>

- Check if the folder actually contains text files
- Try with an **empty ignore list** first - your rules might be too aggressive
- The folder might only contain binary files

</details>

<details>
<summary><strong>Port Already in Use</strong></summary>

Change the port in `server.js`:
```javascript
const PORT = 3001;
```

Or kill the existing process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# macOS / Linux
lsof -i :3000
kill -9 <PID_NUMBER>
```

</details>

<details>
<summary><strong>Subfolders Not Being Read</strong></summary>

- Make sure the folder names are **not** in your ignore list
- Check the terminal logs to see which folders are being skipped
- Only `.git`, `.svn`, `.hg`, and `__pycache__` are auto-ignored
- All other folders (including `vendor`, `lib`, etc.) are read by default

</details>

<details>
<summary><strong>Output File Too Large</strong></summary>

Add these to your ignore list to reduce size:
```
*.min.js, *.min.css, .lock, .map, *.d.ts, [node_modules], [vendor], [bower_components]
```

</details>

<details>
<summary><strong>Large Folders Take Too Long</strong></summary>

- Ignore heavy folders: `[node_modules]`, `[vendor]`, `[dist]`
- Ignore binary extensions: `.png`, `.jpg`, `.woff2`, `.pdf`
- Ignore generated files: `*.min.js`, `*.min.css`, `.map`

</details>

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Node.js](https://nodejs.org) | 16+ | Server runtime environment |
| [Express](https://expressjs.com) | 4.18.x | Web server framework |
| [html-minifier-terser](https://github.com/terser/html-minifier-terser) | 7.2.x | HTML minification engine |
| [clean-css](https://github.com/clean-css/clean-css) | 5.3.x | CSS minification engine |
| [terser](https://github.com/terser/terser) | 5.31.x | JavaScript minification engine |
| [jQuery](https://jquery.com) | 3.7.x | Frontend DOM & AJAX handling |
| [Inter Font](https://rsms.me/inter/) | Variable | UI typography |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Add drag-and-drop folder selection
- [ ] Add progress bar for large folders
- [ ] Add preview of output before saving
- [ ] Add option to copy output to clipboard
- [ ] Add support for custom minification rules
- [ ] Add dark/light theme toggle
- [ ] Add option to split output into multiple files
- [ ] Add file size comparison (original vs minified)
- [ ] Add export as JSON format option
- [ ] Add browser-based folder picker (File System Access API)

---

## 📝 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2024 File Minifier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  <br />
  <strong>⭐ Star this repo if you find it useful!</strong>
  <br />
  <br />
  Made with ❤️ for developers who need to quickly export and share their codebase
  <br />
  <br />
  <a href="https://github.com/yourusername/path-to-txt-file-minifier/issues">Report Bug</a>
  ·
  <a href="https://github.com/yourusername/path-to-txt-file-minifier/issues">Request Feature</a>
</p>
```
