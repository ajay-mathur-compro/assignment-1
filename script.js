const maxContentLength = 1024;

const Theme = {
  LIGHT: "light",
  DARK: "dark",
};

const isFormValid = {
  name: false,
  email: false,
  state: false,
  password: false,
  confPassword: false,
};

// Proxy for the isFormValid object to automatically call toggleSubmit
// whenever any property of isFormValid changes.
const isFormValidProxy = new Proxy(isFormValid, {
  set(target, property, value) {
    target[property] = value;
    toggleSubmit();
    return true;
  },
});

/**
 * Toggles the dark mode theme for the webpage.
 */
function toggleDarkMode() {
  var element = document.body;
  element.classList.toggle(Theme.DARK);
  const themeAnnouncement = document.getElementById("theme-announcement");

  if (element.classList.contains(Theme.DARK)) {
    localStorage.setItem("theme", Theme.DARK);
    themeAnnouncement.textContent = "Switched to dark mode";
  } else {
    localStorage.setItem("theme", Theme.LIGHT);
    themeAnnouncement.textContent = "Switched to light mode";
  }
}

/**
 * Initializes the theme based on the saved preference in localStorage.
 */
window.onload = function () {
  const savedTheme = localStorage.getItem("theme");
  const toggleSwitch = document.getElementById("toggle");
  const themeAnnouncement = document.getElementById("theme-announcement");
  if (savedTheme === Theme.DARK) {
    document.body.classList.add(Theme.DARK);
    toggleSwitch.checked = true;
    themeAnnouncement.textContent = "Dark mode";
  } else {
    toggleSwitch.checked = false;
    themeAnnouncement.textContent = "Light mode";
  }
};

/**
 * Clears the form content by reloading the page.
 */
function clearContent() {
  location.reload();
}

/**
 * Sets the validation classes on a form field based on its validity.
 *
 * @param {HTMLElement} field - The form field element to update.
 * @param {boolean} isValid - A boolean indicating whether the field is valid.
 */
function setValidationClasses(field, isValid) {
  if (field.value.trim() === "") {
    // Reset to default styles if the field is empty
    field.style.setProperty("--border-color", "#ccc");
    field.style.setProperty("--box-shadow-color", "transparent");
  } else if (isValid) {
    field.style.setProperty("--border-color", "green");
    field.style.setProperty("--box-shadow-color", "rgba(0, 255, 0, 0.5)");
  } else {
    field.style.setProperty("--border-color", "red");
    field.style.setProperty("--box-shadow-color", "rgba(255, 0, 0, 0.5)");
  }
}

/**
 * Validates the name field.
 *
 * @param {Event} event - The event object.
 * @returns {boolean} - Returns true if the validation is successful.
 */
function validateName(event) {
  const nameField = event.currentTarget;
  const name = nameField.value.trim();
  const nameErr = nameField.nextElementSibling;
  let isValid = false;
  if (name === "") {
    nameErr.innerHTML = "";
    isValid = false;
  } else if (name.length > maxContentLength) {
    nameErr.innerHTML = "*Name must be less than 1024 characters";
    isValid = false;
  } else if (name.length < 3) {
    nameErr.innerHTML = "*Length should be greater than 3.";
    isValid = false;
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    nameErr.innerHTML = "*Only alphabets are allowed.";
    isValid = false;
  } else {
    nameErr.innerHTML = "";
    isValid = true;
  }
  setValidationClasses(nameField, isValid);
  isFormValidProxy.name = isValid;
  return true;
}

/**
 * Validates the email field.
 *
 * @param {Event} event - The event object.
 * @returns {boolean} - Returns true if the validation is successful.
 */
function validateEmail(event) {
  const emailField = event.currentTarget;
  const email = emailField.value.trim();
  const emailErr = emailField.nextElementSibling;
  const emailPattern =
    /^[a-zA-Z0-9][a-zA-Z0-9.]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let isValid = false;

  if (email === "") {
    emailErr.innerHTML = "";
    isValid = false;
  } else if (!emailPattern.test(email)) {
    emailErr.innerHTML = "*Invalid Email Address.";
    isValid = false;
  } else {
    emailErr.innerHTML = "";
    isValid = true;
  }
  setValidationClasses(emailField, isValid);
  isFormValidProxy.email = isValid;
  return true;
}
/**
 * Validates the state field.
 *
 * @param {Event} event - The event object.
 * @returns {boolean} - Returns true if the validation is successful.
 */
function validateState(event) {
  const stateField = event.currentTarget;
  const state = stateField.value;
  const stateErr = stateField.nextElementSibling;
  let isValid = false;
  if (state === "default") {
    stateErr.innerHTML = "*Please select a state.";
    isValid = false;
  } else {
    stateErr.innerHTML = "";
    isValid = true;
  }
  setValidationClasses(stateField, isValid);
  isFormValidProxy.state = isValid;
  return true;
}

/**
 * Validates the password field.
 *
 * @param {Event} event - The event object.
 * @returns {boolean} - Returns true if the validation is successful.
 */
function validatePassword(event) {
  const passwordField = event.currentTarget;
  const password = passwordField.value;
  const confirmPassword = document.getElementById("confPassword");
  const passErr = document.getElementById("passErr");
  const power = document.getElementById("power-point");
  const passwordStrength = document.getElementById("password-strength");
  const widthPower = ["1%", "25%", "50%", "75%", "100%"];
  const colorPower = ["#DC2626", "#F97316", "#EAB308", "#16A34A", "#166534"];
  let isValid = false;

  if (password === "") {
    passErr.innerHTML = "";
    power.style.width = "0%";
    power.style.backgroundColor = "#D73F40";
    passwordStrength.textContent = "";
    passwordStrength.className = "password-strength";
    isValid = false;
  } else if (password.length < 6) {
    passErr.innerHTML = "*Password should be at least 6 characters.";
    power.style.width = widthPower[0];
    power.style.backgroundColor = colorPower[0];
    passwordStrength.textContent = "Poor";
    passwordStrength.className = "password-strength poor";
    isValid = false;
  } else if (password.length > maxContentLength) {
    passErr.textContent = "*Password must be less than 1024 characters";
    isValid = false;
  } else {
    let point = 0;
    passErr.innerHTML = "";
    const arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
    arrayTest.forEach((regex) => {
      if (regex.test(password)) point += 1;
    });
    power.style.width = widthPower[point];
    power.style.backgroundColor = colorPower[point];

    // Set password strength text and class
    if (point === 1) {
      passwordStrength.textContent = "Poor!";
      passwordStrength.className = "password-strength poor";
    } else if (point === 2) {
      passwordStrength.textContent = "Good!";
      passwordStrength.className = "password-strength good";
    } else if (point === 3) {
      passwordStrength.textContent = "Great!";
      passwordStrength.className = "password-strength great";
    } else if (point === 4) {
      passwordStrength.textContent = "Excellent!";
      passwordStrength.className = "password-strength excellent";
    }

    isValid = true;
  }
  setValidationClasses(passwordField, isValid);
  isFormValidProxy.password = isValid;
  if (confirmPassword.value !== "") {
    validateConfirmPassword();
  }
  return true;
}

/**
 * Validates the confirm password field.
 *
 * @param {Event} event - The event object.
 * @returns {boolean} - Returns true if the validation is successful.
 */
function validateConfirmPassword(event) {
  const passwordField = document.getElementById("password");
  const confPasswordField = event
    ? event.currentTarget
    : document.getElementById("confPassword");
  const password = passwordField.value;
  const confPassword = confPasswordField.value;
  const confPassErr = confPasswordField.nextElementSibling;
  let isValid = false;

  if (confPassword === "") {
    confPassErr.innerHTML = "";
    isValid = false;
  } else if (confPassword !== password) {
    confPassErr.innerHTML = "*Passwords do not match.";
    isValid = false;
  } else {
    confPassErr.innerHTML = "";
    isValid = true;
  }
  setValidationClasses(confPasswordField, isValid);
  isFormValidProxy.confPassword = isValid;
  return true;
}

/**
 * Toggles the visibility of the password field.
 * use event
 */
function togglePasswordVisibility(event) {
  const button = event.currentTarget;
  const passwordInput = button.previousElementSibling;
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  const eyeOpen = button.querySelector(".eye-open");
  const eyeClose = button.querySelector(".eye-close");
  if (type === "password") {
    eyeOpen.style.display = "inline";
    eyeClose.style.display = "none";
  } else {
    eyeOpen.style.display = "none";
    eyeClose.style.display = "inline";
  }
}

/**
 * Toggles the submit button based on the form's validity.
 */
const submitButton = document.getElementById("submit");
function toggleSubmit() {
  const isFormInvalid = Object.values(isFormValid).some((isValid) => !isValid);
  submitButton.disabled = isFormInvalid;
}

/**
 * Handles the form submission.
 *
 * @param {Event} event - The event object.
 */
function submitForm(event) {
  alert("Form submitted successfully!");
  location.reload();
}

//test
