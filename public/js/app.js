$(document).ready(function () {
  const $form = $("#minifierForm");
  const $submitBtn = $("#submitBtn");
  const $folderPath = $("#folderPath");
  const $ignoreList = $("#ignoreList");
  const $resultSection = $("#resultSection");

  // ─────────────── Chip Toggle Logic ─────────────────────────

  $(".chip").on("click", function () {
    $(this).toggleClass("active");
    rebuildIgnoreList();
  });

  function rebuildIgnoreList() {
    let currentVal = $ignoreList.val().trim();
    let manualEntries = [];

    if (currentVal) {
      manualEntries = currentVal
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Collect all chip values
    const allChipValues = [];
    $(".chip").each(function () {
      allChipValues.push($(this).data("value"));
    });

    // Keep only entries that are NOT chip-managed
    manualEntries = manualEntries.filter(
      (entry) => !allChipValues.includes(entry)
    );

    // Add currently active chip values
    $(".chip.active").each(function () {
      manualEntries.push($(this).data("value"));
    });

    $ignoreList.val(manualEntries.join(", "));
  }

  // Sync chips when user manually edits the textarea
  $ignoreList.on("input", function () {
    const val = $(this).val();
    const entries = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    $(".chip").each(function () {
      const chipVal = $(this).data("value");
      if (entries.includes(chipVal)) {
        $(this).addClass("active");
      } else {
        $(this).removeClass("active");
      }
    });
  });

  // ─────────────── Form Submission ───────────────────────────

  $form.on("submit", function (e) {
    e.preventDefault();

    const folderPath = $folderPath.val().trim();
    const ignoreList = $ignoreList.val().trim();

    if (!folderPath) {
      showError("Please enter a folder path.");
      return;
    }

    // Start loading state
    setLoading(true);
    $resultSection.addClass("hidden").empty();

    $.ajax({
      url: "/api/process",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        folderPath: folderPath,
        ignoreList: ignoreList,
      }),
      success: function (data) {
        if (data.success) {
          showSuccess(data);
        } else {
          showError(data.message);
        }
      },
      error: function (xhr) {
        let message = "An unexpected error occurred.";
        try {
          const errData = JSON.parse(xhr.responseText);
          if (errData.message) message = errData.message;
        } catch (e) {
          if (xhr.statusText) message = xhr.statusText;
        }
        showError(message);
      },
      complete: function () {
        setLoading(false);
      },
    });
  });

  // ─────────────── UI Helpers ────────────────────────────────

  function setLoading(loading) {
    if (loading) {
      $submitBtn.addClass("loading").prop("disabled", true);
    } else {
      $submitBtn.removeClass("loading").prop("disabled", false);
    }
  }

  function showSuccess(data) {
    // Build ignored patterns section
    let patternsHTML = "";
    if (data.ignoredPatterns && data.ignoredPatterns.length > 0) {
      const tags = data.ignoredPatterns
        .map((p) => `<span class="info-tag info-tag-pattern">${escapeHtml(p)}</span>`)
        .join("");
      patternsHTML = `
        <div class="ignored-info ignored-patterns-info">
          <div class="ignored-info-label">Ignored File Patterns</div>
          ${tags}
        </div>
      `;
    }

    // Build ignored folders section
    let foldersHTML = "";
    if (data.ignoredFolders && data.ignoredFolders.length > 0) {
      const tags = data.ignoredFolders
        .map((f) => `<span class="info-tag info-tag-folder">${escapeHtml(f)}</span>`)
        .join("");
      foldersHTML = `
        <div class="ignored-info ignored-folders-info">
          <div class="ignored-info-label">Ignored Folders</div>
          ${tags}
        </div>
      `;
    }

    const totalIgnoreRules =
      (data.ignoredExtensions ? data.ignoredExtensions.length : 0) +
      (data.ignoredPatterns ? data.ignoredPatterns.length : 0) +
      (data.ignoredFiles ? data.ignoredFiles.length : 0) +
      (data.ignoredFolders ? data.ignoredFolders.length : 0);

    const html = `
      <div class="result-box success">
        <span class="result-icon">✅</span>
        <div class="result-body">
          <div class="result-title">Export Successful!</div>
          <div class="result-message">${escapeHtml(data.message)}</div>

          <div class="result-stats">
            <div class="stat-card">
              <div class="stat-value">${data.fileCount}</div>
              <div class="stat-label">Files</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.folderCount || "—"}</div>
              <div class="stat-label">Folders</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.fileSize}</div>
              <div class="stat-label">Output Size</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.skippedFiles || 0}</div>
              <div class="stat-label">Skipped</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${totalIgnoreRules}</div>
              <div class="stat-label">Ignore Rules</div>
            </div>
          </div>

          ${patternsHTML}
          ${foldersHTML}

          <div class="output-path">
            <div class="output-path-label">Output File</div>
            ${escapeHtml(data.outputPath)}
          </div>
        </div>
      </div>
    `;

    $resultSection.html(html).removeClass("hidden");

    $("html, body").animate(
      { scrollTop: $resultSection.offset().top - 40 },
      400
    );
  }

  function showError(message) {
    const html = `
      <div class="result-box error">
        <span class="result-icon">❌</span>
        <div class="result-body">
          <div class="result-title">Something went wrong</div>
          <div class="result-message">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    $resultSection.html(html).removeClass("hidden");

    $("html, body").animate(
      { scrollTop: $resultSection.offset().top - 40 },
      400
    );
  }

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});