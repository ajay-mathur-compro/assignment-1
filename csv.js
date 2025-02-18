//Event listener for drops outside the drop zone

document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
});

document.body.addEventListener("drop", (event) => {
  event.preventDefault();
  // Check if the drop target is not the drop zone or its children
  const dropZone = document.getElementById("drop-area");
  if (!dropZone.contains(event.target)) {
    alert("Please drop the file in the designated drop area.");
  }
});

// Handle drag over event to prevent default behavior
function handleDragOver(event) {
  event.preventDefault();
}

// Handle drop event to process the dropped file
function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  processFile(file);
}

// Trigger file input click event for file selection
function handleBrowseLinkTrigger(event) {
  // Check if the event type is 'click' or if the key pressed is 'Enter' or space
  if (event.type === "click" || event.key === "Enter" || event.key === " ") {
    event.preventDefault(); // Prevent the default action
    document.getElementById("file-input").click(); // Trigger the file input click
  }
}

// Handle file input change event to process the selected file
function handleFile(event) {
  console.log("handleFile Triggered");
  processFile(event.target.files[0]);
  event.target.value = ""; // Reset input to allow re-uploading the same file
}

// Process the uploaded file
function processFile(file) {
  // Check if the file is a valid CSV file
  if (!file || file.type !== "text/csv") {
    alert("Invalid file type. Please upload a CSV file.");
    return;
  }
  // Check if the file is empty
  if (file.size === 0) {
    alert("Empty file detected. Please upload a valid CSV file.");
    return;
  }
  // Parse the CSV file using PapaParse library
  Papa.parse(file, {
    complete: (results) => validateCSV(results.data),
    header: true,
    skipEmptyLines: true,
  });
}

// Validate the parsed CSV data
function validateCSV(data) {
  // Check if the CSV data is empty after parsing
  if (!data.length) {
    alert("CSV file is empty after parsing.");
    return;
  }
  console.log(data);

  // Display the validation results section
  document.getElementById("validation-results").style.display = "block";

  const headers = Object.keys(data[0]);
  
  const allowedColumns = [
    "page_label",
    "placement",
    "tooltip",
    "link_type",
    "icon_style",
    "x",
    "y",
    "h",
    "w",
    "base_path",
    "url",
    "page",
    "audio_1",
    "audio_2",
    "audio_3",
    "audio_4",
    "readalong_group",
    "animation-color",
    "video_1",
    "subtitle_1",
    "subtitle_2",
    "subtitle_3",
    "subtitle_4",
    "html_ele_ref",
    "view_mode",
  ];
  const requiredColumns = [
    "page_label",
    "placement",
    "link_type",
    "base_path",
    "url",
    "audio_1",
    "icon_style",
    "page",
  ];
  const allowedBaseURLs = ["VHL_CENTRAL_M3A", "VHL_CENTRAL_ASSETS"];

  const numericColumns = ["x", "y", "h", "w"];
  
  // Helper function to update display
  function updateUI(id, passed, message) {
    const iconEl = document.getElementById(`${id}-icon`);
    const messageEl = document.getElementById(`${id}-message`);
    iconEl.className = `check-icon ${passed ? "passed" : "failed"}`;
    iconEl.textContent = passed ? "✓" : "✗";
    messageEl.textContent = message;
    return passed;
  }

  // Structural Validation
  const hasRequiredColumns = requiredColumns.every((col) =>
    headers.includes(col)
  );
  const hasOnlyAllowedColumns = headers.every((col) =>
    allowedColumns.includes(col)
  );

  const worksheetValid = updateUI(
    "worksheet",
    true,
    "Valid sheet found in the workbook."
  );
  const requiredColumnsValid = updateUI(
    "required-columns",
    hasRequiredColumns,
    hasRequiredColumns
      ? `Required columns present: ${requiredColumns.join(", ")}`
      : `Missing columns: ${requiredColumns
          .filter((col) => !headers.includes(col))
          .join(", ")}`
  );
  const allowedColumnsValid = updateUI(
    "allowed-columns",
    hasOnlyAllowedColumns,
    hasOnlyAllowedColumns
      ? "All headers are valid."
      : `Invalid columns found: ${headers
          .filter((col) => !allowedColumns.includes(col))
          .join(", ")}`
  );
  const sequenceValid = updateUI(
    "column-sequence",
    isValidColumnSequence(headers, allowedColumns),
    isValidColumnSequence(headers, allowedColumns)
      ? "All columns found in expected sequence"
      : "Column sequence is incorrect. Expected order: " +
          allowedColumns.join(", ")
  );

  // Helper function to check relative order
  function isValidColumnSequence(headers, allowedColumns) {
    let lastFoundIndex = -1;

    // Check each header's position relative to others
    for (const header of headers) {
      const currentIndex = allowedColumns.indexOf(header);

      // If current header is found in allowed columns
      if (currentIndex !== -1) {
        // If this column appears earlier than a previous column in the allowed sequence
        if (currentIndex < lastFoundIndex) {
          return false;
        }
        lastFoundIndex = currentIndex;
      }
    }

    return true;
  }

  // Structural Validation Banner
  const structuralPassed =
    worksheetValid &&
    requiredColumnsValid &&
    allowedColumnsValid &&
    sequenceValid;
  const structuralBanner = document.getElementById("structural-banner");
  structuralBanner.className = `status-banner ${
    structuralPassed ? "passed" : "failed"
  }`;
  structuralBanner.textContent = structuralPassed
    ? "PASSED structural validation."
    : "FAILED Structural validation";
  structuralBanner.style.display = "block";

  // Data Validation
  const dataSection = document.getElementById("data-section");
  const dataBanner = document.getElementById("data-banner");
  const dataChecksContainer = document.getElementById("data-checks");
  const dataValidationNote = document.getElementById("data-validation-note");
  if (!structuralPassed) {
    dataSection.style.display = "none";
    dataBanner.style.display = "none";
    dataValidationNote.style.display = "block";
    return;
  }
  dataSection.style.display = "block";
  dataBanner.style.display = "block";
  dataValidationNote.style.display = "none";
  dataChecksContainer.innerHTML = ""; // Clear previous checks

  // Validate each row of data
  const dataErrors = data.reduce((errors, row, index) => {
    requiredColumns.forEach((col) => {
      if (!row[col] || row[col].trim() === "") {
        errors.push({
          row: index + 1,
          error: `Required field '${col}' is empty.`,
        });
      }
    });
    if (
      row.url &&
      !allowedBaseURLs.some((baseUrl) => row.url.includes(baseUrl))
    ) {
      errors.push({
        row: index + 1,
        error: `Invalid base URL: '${row.url}'. Must contain 'VHL_CENTRAL_M3A' or 'VHL_CENTRAL_ASSETS'.`,
      });
    }
    numericColumns.forEach((col) => {
      if (row[col] && isNaN(Number(row[col]))) {
        errors.push({
          row: index + 1,
          error: `Column '${col}' must be a number. Found value: '${row[col]}'`,
        });
      }
    });

    // String type validation for non-numeric columns
    headers.forEach((col) => {
      if (
        !numericColumns.includes(col) &&
        row[col] &&
        !isNaN(Number(row[col]))
      ) {
        console.log(Number(row[col]));
        errors.push({
          row: index + 1,
          error: `Column '${col}' must be a string. Found value: ${row[col]}`,
        });
      }
    });
    return errors;
  }, []);

  // Display data validation results
  if (!dataErrors.length) {
    dataChecksContainer.innerHTML = `
      <div class="validation-check">
        <span class="check-icon passed">✓</span>
        <div class="check-content">
          <h3>Data Validation</h3>
          <p>All required fields are valid, and URLs are correctly formatted.</p>
        </div>
      </div>
    `;
    dataBanner.className = "status-banner passed";
    dataBanner.textContent = "PASSED data validation.";
  } else {
    dataChecksContainer.innerHTML = dataErrors
      .map(
        (error) => `
      <div class="validation-check">
        <span class="check-icon failed">✗</span>
        <div class="check-content">
          <h3>Row ${error.row} Validation</h3>
          <p>${error.error}</p>
        </div>
      </div>
    `
      )
      .join("");
    dataBanner.className = "status-banner failed";
    dataBanner.textContent = "FAILED data validation.";
  }
}
