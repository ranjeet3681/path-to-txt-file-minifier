const express = require("express");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const CleanCSS = require("clean-css");
const { minify: htmlMinify } = require("html-minifier-terser");
const { minify: terserMinify } = require("terser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─────────────────────────── Config ───────────────────────────

const TEXT_EXTENSIONS = new Set([
  ".html", ".htm", ".xhtml", ".shtml",
  ".css", ".scss", ".sass", ".less",
  ".js", ".jsx", ".mjs", ".cjs",
  ".ts", ".tsx",
  ".json", ".jsonc", ".json5",
  ".xml", ".svg", ".xsl", ".xslt",
  ".md", ".markdown", ".mdx",
  ".txt", ".text", ".log",
  ".yaml", ".yml",
  ".toml", ".ini", ".cfg", ".conf",
  ".env", ".env.local", ".env.development", ".env.production",
  ".sh", ".bash", ".zsh", ".fish", ".bat", ".cmd", ".ps1",
  ".py", ".pyw",
  ".rb", ".erb",
  ".php", ".phtml",
  ".java", ".kt", ".kts", ".groovy", ".scala",
  ".c", ".h", ".cpp", ".hpp", ".cc", ".cxx",
  ".cs",
  ".go",
  ".rs",
  ".swift",
  ".r", ".R",
  ".lua",
  ".pl", ".pm",
  ".sql",
  ".graphql", ".gql",
  ".vue", ".svelte",
  ".astro",
  ".twig", ".hbs", ".handlebars", ".ejs", ".pug", ".jade",
  ".csv", ".tsv",
  ".htaccess", ".nginx",
  ".dockerfile",
  ".gitignore", ".gitattributes",
  ".editorconfig",
  ".prettierrc", ".eslintrc", ".babelrc",
  ".npmrc", ".nvmrc",
  ".lock",
]);

// ──── MINIMAL default ignored folders (only truly internal ones) ────
const DEFAULT_IGNORE_DIRS = new Set([
  ".git",
  ".svn",
  ".hg",
  "__pycache__",
]);

const SEPARATOR = "\n\n" + "=".repeat(56) + "\n\n";

// ─────────────────────── Helpers ──────────────────────────────

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXTENSIONS.has(ext)) return true;

  const baseName = path.basename(filePath).toLowerCase();
  const dotlessTextFiles = [
    "makefile", "rakefile", "gemfile", "procfile",
    "dockerfile", "vagrantfile", "cakefile",
    "license", "readme", "changelog", "authors",
    "contributing", "todo",
  ];
  if (dotlessTextFiles.includes(baseName)) return true;

  return false;
}

function isBinaryContent(buffer) {
  const checkLength = Math.min(buffer.length, 8192);
  for (let i = 0; i < checkLength; i++) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

// ──────────────────── Minifiers ───────────────────────────────

async function minifyHTML(content) {
  try {
    return await htmlMinify(content, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeAttributeQuotes: true,
      minifyCSS: true,
      minifyJS: true,
      collapseBooleanAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
    });
  } catch {
    return basicMinify(content);
  }
}

function minifyCSS(content) {
  try {
    const result = new CleanCSS({
      level: 2,
      returnPromise: false,
    }).minify(content);
    return result.styles || basicMinify(content);
  } catch {
    return basicMinify(content);
  }
}

async function minifyJS(content) {
  try {
    const result = await terserMinify(content, {
      compress: true,
      mangle: false,
    });
    return result.code || basicMinify(content);
  } catch {
    return basicMinify(content);
  }
}

function minifyJSON(content) {
  try {
    return JSON.stringify(JSON.parse(content));
  } catch {
    return basicMinify(content);
  }
}

function basicMinify(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "")
    .trim();
}

async function minifyContent(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".html":
    case ".htm":
    case ".xhtml":
    case ".shtml":
    case ".php":
    case ".phtml":
    case ".vue":
    case ".svelte":
    case ".astro":
    case ".ejs":
    case ".hbs":
    case ".handlebars":
    case ".pug":
    case ".jade":
    case ".twig":
    case ".erb":
      return await minifyHTML(content);

    case ".css":
    case ".scss":
    case ".sass":
    case ".less":
      return minifyCSS(content);

    case ".js":
    case ".jsx":
    case ".mjs":
    case ".cjs":
    case ".ts":
    case ".tsx":
      return await minifyJS(content);

    case ".json":
    case ".jsonc":
    case ".json5":
      return minifyJSON(content);

    default:
      return basicMinify(content);
  }
}

// ────────────────── Pattern Matching ──────────────────────────

function wildcardToRegex(pattern) {
  let regexStr = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\*/g, "___STAR___")
    .replace(/\\\?/g, "___QMARK___");

  regexStr = regexStr
    .replace(/___STAR___/g, ".*")
    .replace(/___QMARK___/g, ".");

  return new RegExp("^" + regexStr + "$", "i");
}

function matchesAnyPattern(fileName, patterns) {
  for (const pattern of patterns) {
    if (pattern.test(fileName)) {
      return true;
    }
  }
  return false;
}

// ───────────── Parse Ignore List ──────────────────────────────

/**
 * Parse the ignore string into FOUR categories:
 *
 *  1. ignoreFiles       → Set of full normalized file paths (lowercase)
 *  2. ignoreExtensions  → Set of extensions like ".zip", ".png"
 *  3. ignorePatterns    → Array of compiled RegExp from wildcards like "*.spec.ts"
 *  4. ignoreFolders     → Set of folder names like "node_modules", "vendor", "dist"
 *
 * Folder ignore syntax:  [foldername]
 * Example:  [node_modules], [vendor], [dist], [.vscode]
 */
function parseIgnoreList(ignoreString) {
  const ignoreFiles = new Set();
  const ignoreExtensions = new Set();
  const ignorePatterns = [];
  const ignoreFolders = new Set();

  if (!ignoreString || !ignoreString.trim()) {
    return { ignoreFiles, ignoreExtensions, ignorePatterns, ignoreFolders };
  }

  const tokens = ignoreString.split(",").map((t) => t.trim()).filter(Boolean);

  for (const token of tokens) {
    // ──── Folder ignore: [foldername] ────
    const folderMatch = token.match(/^\[(.+)\]$/);
    if (folderMatch) {
      ignoreFolders.add(folderMatch[1].toLowerCase());
      continue;
    }

    // ──── Wildcard pattern: *.spec.ts, *.test.js ────
    if (token.includes("*") || token.includes("?")) {
      const regex = wildcardToRegex(token);
      ignorePatterns.push({
        original: token,
        regex: regex,
      });
      continue;
    }

    // ──── Extension: .zip, .png ────
    if (
      token.startsWith(".") &&
      !token.includes(path.sep) &&
      !token.includes("/") &&
      !token.includes("\\")
    ) {
      ignoreExtensions.add(token.toLowerCase());
      continue;
    }

    // ──── Full file path ────
    ignoreFiles.add(path.normalize(token).toLowerCase());
  }

  return { ignoreFiles, ignoreExtensions, ignorePatterns, ignoreFolders };
}

// ─────────────── Recursive file walker ────────────────────────

async function walkDirectory(
  dirPath,
  ignoreFiles,
  ignoreExtensions,
  ignorePatterns,
  ignoreFolders,
  outputFileName,
  stats
) {
  const results = [];

  let entries;
  try {
    entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
  } catch (err) {
    console.log(`  ⚠️  Cannot read directory: ${dirPath} (${err.code})`);
    stats.skippedDirs++;
    return results;
  }

  // Sort for consistent output
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const normalizedPath = path.normalize(fullPath);

    // ──────────── DIRECTORY ────────────
    if (entry.isDirectory()) {
      const folderNameLower = entry.name.toLowerCase();

      // Check default ignored folders
      if (DEFAULT_IGNORE_DIRS.has(folderNameLower)) {
        console.log(`  📁 Skipping (default ignore): ${fullPath}`);
        stats.skippedDirs++;
        continue;
      }

      // Check user-specified ignored folders
      if (ignoreFolders.has(folderNameLower)) {
        console.log(`  📁 Skipping (user ignore): ${fullPath}`);
        stats.skippedDirs++;
        continue;
      }

      // ✅ RECURSE INTO SUBFOLDER
      console.log(`  📂 Entering: ${fullPath}`);
      stats.totalDirs++;

      const subResults = await walkDirectory(
        fullPath,
        ignoreFiles,
        ignoreExtensions,
        ignorePatterns,
        ignoreFolders,
        outputFileName,
        stats
      );
      results.push(...subResults);

    // ──────────── FILE ────────────
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const fileName = entry.name;

      // Skip our own output file
      if (fileName === outputFileName) {
        continue;
      }

      // Check ignore by extension
      if (ignoreExtensions.has(ext)) {
        stats.skippedFiles++;
        continue;
      }

      // Check ignore by full path
      if (ignoreFiles.has(normalizedPath.toLowerCase())) {
        console.log(`  🚫 Ignored (path): ${normalizedPath}`);
        stats.skippedFiles++;
        continue;
      }

      // Check ignore by wildcard pattern
      if (ignorePatterns.length > 0) {
        const patternRegexes = ignorePatterns.map((p) => p.regex);
        if (matchesAnyPattern(fileName, patternRegexes)) {
          console.log(`  🚫 Ignored (pattern): ${normalizedPath}`);
          stats.skippedFiles++;
          continue;
        }
      }

      // Check if it's a text file by extension
      if (!isTextFile(fullPath)) {
        stats.skippedFiles++;
        continue;
      }

      // Read file
      try {
        const buffer = await fsPromises.readFile(fullPath);

        // Skip binary content
        if (isBinaryContent(buffer)) {
          stats.skippedFiles++;
          continue;
        }

        const content = buffer.toString("utf-8");

        // Skip empty files
        if (!content.trim()) {
          stats.skippedFiles++;
          continue;
        }

        const minified = await minifyContent(fullPath, content);

        console.log(`  ✅ Processed: ${normalizedPath}`);
        stats.processedFiles++;

        results.push({
          path: normalizedPath,
          content: minified,
        });
      } catch (err) {
        console.log(`  ⚠️  Error reading: ${normalizedPath} (${err.message})`);
        stats.errorFiles++;
      }
    }
  }

  return results;
}

// ──────────────────── API Route ───────────────────────────────

app.post("/api/process", async (req, res) => {
  try {
    const { folderPath, ignoreList } = req.body;

    if (!folderPath || !folderPath.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid folder path.",
      });
    }

    const normalizedPath = path.normalize(folderPath.trim());

    // Check if folder exists
    try {
      const stats = await fsPromises.stat(normalizedPath);
      if (!stats.isDirectory()) {
        return res.status(400).json({
          success: false,
          message: "The provided path is not a directory.",
        });
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: `Folder not found: ${normalizedPath}`,
      });
    }

    console.log("\n" + "═".repeat(60));
    console.log(`📁 Processing: ${normalizedPath}`);
    console.log(`🚫 Ignore list: ${ignoreList || "(none)"}`);
    console.log("═".repeat(60));

    // Parse ignore list
    const { ignoreFiles, ignoreExtensions, ignorePatterns, ignoreFolders } =
      parseIgnoreList(ignoreList || "");

    // Merge default + user folder ignores for logging
    const allIgnoredFolders = new Set([...DEFAULT_IGNORE_DIRS, ...ignoreFolders]);

    console.log(`  Ignored extensions: ${[...ignoreExtensions].join(", ") || "(none)"}`);
    console.log(`  Ignored patterns: ${ignorePatterns.map((p) => p.original).join(", ") || "(none)"}`);
    console.log(`  Ignored folders: ${[...allIgnoredFolders].join(", ") || "(none)"}`);
    console.log(`  Ignored files: ${[...ignoreFiles].join(", ") || "(none)"}`);
    console.log("─".repeat(60));

    // Determine output file name ahead of time (so we skip it during walk)
    const folderName = path.basename(normalizedPath);
    const outputFileName = `${folderName}_minified_output.txt`;

    // Stats tracking
    const walkStats = {
      totalDirs: 1, // root counts as 1
      skippedDirs: 0,
      processedFiles: 0,
      skippedFiles: 0,
      errorFiles: 0,
    };

    // Walk directory and collect files
    const files = await walkDirectory(
      normalizedPath,
      ignoreFiles,
      ignoreExtensions,
      ignorePatterns,
      ignoreFolders,
      outputFileName,
      walkStats
    );

    console.log("─".repeat(60));
    console.log(`  📊 Directories entered: ${walkStats.totalDirs}`);
    console.log(`  📊 Directories skipped: ${walkStats.skippedDirs}`);
    console.log(`  📊 Files processed: ${walkStats.processedFiles}`);
    console.log(`  📊 Files skipped: ${walkStats.skippedFiles}`);
    console.log(`  📊 Files with errors: ${walkStats.errorFiles}`);

    if (files.length === 0) {
      console.log("  ❌ No readable text files found.\n");
      return res.json({
        success: false,
        message:
          "No readable text files found in the given folder. Check if the folder path is correct and that files are not all excluded by ignore rules.",
      });
    }

    // Build output
    const outputParts = files.map((f) => `${f.path}:\n${f.content}`);
    const outputContent = outputParts.join(SEPARATOR);

    // Write output file
    const outputFilePath = path.join(normalizedPath, outputFileName);

    await fsPromises.writeFile(outputFilePath, outputContent, "utf-8");

    // Calculate file size
    const outputStats = await fsPromises.stat(outputFilePath);
    const fileSizeKB = (outputStats.size / 1024).toFixed(2);
    const fileSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2);
    const sizeDisplay =
      outputStats.size > 1024 * 1024
        ? `${fileSizeMB} MB`
        : `${fileSizeKB} KB`;

    console.log(`  ✅ Output: ${outputFilePath} (${sizeDisplay})`);
    console.log("═".repeat(60) + "\n");

    return res.json({
      success: true,
      message: `Successfully processed ${files.length} file(s) from ${walkStats.totalDirs} folder(s).`,
      outputPath: outputFilePath,
      fileCount: files.length,
      folderCount: walkStats.totalDirs,
      skippedFiles: walkStats.skippedFiles,
      skippedDirs: walkStats.skippedDirs,
      fileSize: sizeDisplay,
      ignoredExtensions: [...ignoreExtensions],
      ignoredFiles: [...ignoreFiles],
      ignoredPatterns: ignorePatterns.map((p) => p.original),
      ignoredFolders: [...ignoreFolders],
    });
  } catch (err) {
    console.error("Processing error:", err);
    return res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
    });
  }
});

// ────────────────────── Start ─────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 File Minifier is running at http://localhost:${PORT}\n`);
});