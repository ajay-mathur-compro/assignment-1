// Global alert function to centralize all alert messages
function showAlert(message) {
  alert(message);
}

// Prevent default drag behavior
function handleDragOver(event) {
  event.preventDefault();
}

// Handle file drop events in the designated drop zone
function handleDrop(event) {
  event.preventDefault();
  const dropZone = document.getElementById("drop-area");
  // Verify drop location is within the designated area
  if (!dropZone || !dropZone.contains(event.target)) {
    showAlert("Oops! Please drop your file inside the designated drop area.");
  } else {
    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    } else {
      showAlert("No file detected. Please drop a file in the designated area.");
    }
  }
}

// Handle click events on the browse link/button
function handleBrowseLinkTrigger(event) {
  event.preventDefault();
  const fileInput = document.getElementById("file-input");
  if (fileInput) {
    fileInput.click();
  } else {
    showAlert(
      "Unable to find the file input element. Please ensure the file input element is present in the HTML."
    );
  }
}

// Handle file selection from the file input
function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
    event.target.value = ""; // Reset input to allow re-uploading the same file
  } else {
    showAlert(
      "Oops! It looks like you didn't select a file. Please choose a file and try again."
    );
  }
}

// Process the uploaded file and initiate CSV parsing
function processFile(file) {
  // Validate file extension
  if (!file.name.endsWith(".csv")) {
    showAlert(
      "Invalid file type detected. Please ensure you are uploading a file with a .csv extension."
    );
    return;
  }
  // Check for empty file
  if (file.size === 0) {
    showAlert(
      "The file you uploaded is empty. Please select a CSV file with content and try again."
    );
    return;
  }
  // Parse CSV using Papa Parse library
  Papa.parse(file, {
    complete: (results) => validateCSV(results.data),
    error: (error) => {
      showAlert(
        "An error occurred while parsing the CSV file. Please check the file and try again."
      );
      console.error(`Error parsing CSV file: ${error.message}`);
    },
    header: true,
    skipEmptyLines: true,
  });
}

// Update UI elements with validation results
function updateUI(id, passed, message) {
  const iconEl = document.getElementById(`${id}-icon`);
  const messageEl = iconEl.nextElementSibling.lastElementChild;
  iconEl.className = `check-icon ${passed ? "passed" : "failed"}`;
  iconEl.textContent = passed ? "✓" : "✗";
  messageEl.textContent = message;
  return passed;
}

// Validate if columns appear in the correct sequence
function isValidColumnSequence(headers, allowedColumns) {
  let lastFoundIndex = -1;
  for (const header of headers) {
    const currentIndex = allowedColumns.indexOf(header);
    if (currentIndex !== -1) {
      if (currentIndex < lastFoundIndex) {
        return false;
      }
      lastFoundIndex = currentIndex;
    }
  }
  return true;
}

// Main CSV validation function
function validateCSV(data) {
  // Check for empty data after parsing
  if (!data.length) {
    showAlert(
      "The CSV file you uploaded is empty after parsing. Please ensure the file contains data and try again."
    );
    return;
  }

  // Set up validation results display
  const validationResultSection = document.getElementById("validation-results");
  const computedStyle = getComputedStyle(document.documentElement);
  const validationResultDisplay = computedStyle
    .getPropertyValue("--validationResultSectionDisplay")
    .trim();
  validationResultSection.style.setProperty("display", validationResultDisplay);

  const headers = Object.keys(data[0]);

  // Define allowed columns in the CSV
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

  // Define required columns that must be present
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

  // Define allowed base URLs and numeric columns
  const allowedBaseURLs = ["VHL_CENTRAL_M3A", "VHL_CENTRAL_ASSETS"];
  const numericColumns = ["x", "y", "h", "w"];

  // Perform structural validation
  const hasRequiredColumns = requiredColumns.every((col) =>
    headers.includes(col)
  );
  const hasOnlyAllowedColumns = headers.every((col) =>
    allowedColumns.includes(col)
  );
  const isValidSequence = hasRequiredColumns && hasOnlyAllowedColumns ? isValidColumnSequence(headers, allowedColumns) : false;

  // Update UI with validation results
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
    isValidSequence,
    isValidSequence
      ? "All columns found in expected sequence"
      : `Column sequence is incorrect. The columns should appear in the following order: ${allowedColumns.join(
          ", "
        )}`
  );

  // Update structural validation banner
  const structuralPassed =
    worksheetValid &&
    requiredColumnsValid &&
    allowedColumnsValid &&
    sequenceValid;
  const structuralBanner = validationResultSection.firstElementChild;
  structuralBanner.className = `status-banner ${
    structuralPassed ? "passed" : "failed"
  }`;
  structuralBanner.textContent = structuralPassed
    ? "PASSED structural validation."
    : "FAILED Structural validation";
  structuralBanner.style.display = "block";

  // Set up data validation elements
  const dataBanner = document.getElementById("data-banner");
  const dataSection = dataBanner.nextElementSibling;
  const dataChecksContainer = dataSection.lastElementChild;
  const dataValidationNote = dataSection.nextElementSibling;

  // Skip data validation if structural validation failed
  if (!structuralPassed) {
    dataSection.style.display = "none";
    dataBanner.style.display = "none";
    dataValidationNote.style.display = "block";
    return;
  }

  // Prepare for data validation display
  dataSection.style.display = "block";
  dataBanner.style.display = "block";
  dataValidationNote.style.display = "none";
  dataChecksContainer.innerHTML = "";

  // Validate each row of data
  const dataErrors = data.reduce((errors, row, index) => {
    // Check required fields
    requiredColumns.forEach((col) => {
      if (!row[col] || row[col].trim() === "") {
        errors.push({
          row: index + 1,
          error: `Required field '${col}' is empty.`,
        });
      }
    });

    // Validate URL format
    if (
      row.url &&
      !allowedBaseURLs.some((baseUrl) => row.url.includes(baseUrl))
    ) {
      errors.push({
        row: index + 1,
        error: `Invalid base URL: '${row.url}'. Please ensure the URL contains either 'VHL_CENTRAL_M3A' or 'VHL_CENTRAL_ASSETS'.`,
      });
    }

    // Validate numeric columns
    numericColumns.forEach((col) => {
      if (row[col] && isNaN(Number(row[col]))) {
        errors.push({
          row: index + 1,
          error: `Column '${col}' must contain a numeric value. Please correct the value: '${row[col]}'`,
        });
      }
    });

    // Validate string columns
    headers.forEach((col) => {
      if (
        !numericColumns.includes(col) &&
        row[col] &&
        !isNaN(Number(row[col]))
      ) {
        errors.push({
          row: index + 1,
          error: `Column '${col}' must contain text. Found numeric value: ${row[col]}. Please enter a valid text value.`,
        });
      }
    });

    return errors;
  }, []);

  // Display final validation results
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
