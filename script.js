const maxContentLength = 1024;
const Theme = {
    dark: "dark-mode",
};
const power = document.getElementById("power-point");
const submitButton = document.querySelector('button[type="submit"]');
const toggleSwitch = document.getElementById("toggle");
function toggleDarkMode() {
    var element = document.body;
    element.classList.toggle(Theme.dark);

    if (element.classList.contains(Theme.dark)) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}
window.onload = function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add(Theme.dark);
        toggleSwitch.checked = true;
    } else {
        toggleSwitch.checked = false;
    }
};
const fields = {
    name: "name",
    email: "email",
    phone: "phone",
    age: "age",
    password: "password",
    confPassword: "confPassword",
}
const errors = {
    name: "nameErr",
    email: "emailErr",
    phone: "phoneErr",
    age: "ageErr",
    password: "passErr",
    confPassword: "confPassErr",
}
function clearContent() {
    for (const key in fields) {
        document.getElementById(fields[key]).classList.remove("valid");
        document.getElementById(fields[key]).classList.remove("invalid");
        document.getElementById(errors[key]).innerHTML = "";
    }
    power.style.width = "0%";
    power.style.backgroundColor = "#D73F40";
}
let touchedFields = {
    name: false,
    email: false,
    phone: false,
    age: false,
    password: false,
    confPassword: false,
};

function setValidationClasses(field, isValid) {
    if (isValid) {
        field.classList.remove("invalid");
        field.classList.add("valid");
    } else {
        field.classList.remove("valid");
        field.classList.add("invalid");
    }
}

function validateName() {

    if (!touchedFields.name) return true;
    const nameField = document.getElementById("name");
    const name = nameField.value.trim();
    const nameErr = document.getElementById("nameErr");

    if (name.length > maxContentLength) {
        nameErr.textContent = "*Name must be less than 1024 characters";
        setValidationClasses(nameField, false);
        return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        nameErr.innerHTML = "*Only alphabets are allowed.";
        setValidationClasses(nameField, false);
        return false;
    }
    if (name.length < 3) {
        nameErr.innerHTML = "*Length should be greater than 3.";
        setValidationClasses(nameField, false);
        return false;
    }
    nameErr.innerHTML = "";
    setValidationClasses(nameField, true);
    return true;
}

function validateEmail() {
    if (!touchedFields.email) return true;
    const emailField = document.getElementById("email");
    const email = emailField.value.trim();
    const emailErr = document.getElementById("emailErr");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailErr.innerHTML = "*Invalid Email Address.";
        setValidationClasses(emailField, false);
        return false;
    }
    emailErr.innerHTML = "";
    setValidationClasses(emailField, true);
    return true;
}

function validatePhone() {
    if (!touchedFields.phone) return true;
    const phoneField = document.getElementById("phone");
    const phone = phoneField.value.trim();
    const phoneErr = document.getElementById("phoneErr");

    if (!/^\d{10}$/.test(phone)) {
        phoneErr.innerHTML = "*Phone number must be exactly 10 digits.";
        setValidationClasses(phoneField, false);
        return false;
    }
    phoneErr.innerHTML = "";
    setValidationClasses(phoneField, true);
    return true;
}
function validateAge() {
    if (!touchedFields.age) return true;
    const ageField = document.getElementById("age");
    const age = ageField.value.trim();
    const ageErr = document.getElementById("ageErr");

    if (age < 1 || age > 100) {
        ageErr.innerHTML = "*Age should be between 1 and 100.";
        setValidationClasses(ageField, false);
        return false;
    }
    ageErr.innerHTML = "";
    setValidationClasses(ageField, true);
    return true;
}

function validatePassword() {
    if (!touchedFields.password) return true;
    const passwordField = document.getElementById("password");
    const password = passwordField.value;
    const passErr = document.getElementById("passErr");
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    if (password.length < 6) {
        passErr.innerHTML = "*Password should be at least 6 characters.";
        power.style.width = widthPower[0];
        power.style.backgroundColor = colorPower[0];
        setValidationClasses(passwordField, false);
        return false;
    }

    if (password.length > maxContentLength) {
        passErr.textContent = "*Password must be less than 1024 characters";
        setValidationClasses(passwordField, false);
        return false;
    }

    let point = 0;
    passErr.innerHTML = "";
    const arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
    arrayTest.forEach((regex) => {
        if (regex.test(password)) point += 1;
    });
    power.style.width = widthPower[point];
    power.style.backgroundColor = colorPower[point];
    setValidationClasses(passwordField, true);
    return true;
}

function validateConfirmPassword() {
    const passwordField = document.getElementById("password");
    const confPasswordField = document.getElementById("confPassword");
    if (!touchedFields.confPassword) return true;
    const password = passwordField.value;
    const confPassword = confPasswordField.value;
    const confPassErr = document.getElementById("confPassErr");

    if (confPassword !== password) {
        confPassErr.innerHTML = "*Passwords do not match.";
        setValidationClasses(confPasswordField, false);
        return false;
    }
    confPassErr.innerHTML = "";
    setValidationClasses(confPasswordField, true);
    return true;
}

function validateForm() {
    const isFormValid =
        validateName() &&
        validateEmail() &&
        validatePhone() &&
        validateAge() &&
        validatePassword() &&
        validateConfirmPassword();
    submitButton.disabled = !isFormValid;
}


document.getElementById("form").addEventListener("input", function (event) {
    touchedFields[event.target.id] = true;
    validateForm();
})


function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    const eyeOpen = document.querySelector(".eye-open");
    const eyeClose = document.querySelector(".eye-close");
    if (type === "password") {
        eyeOpen.style.display = "inline";
        eyeClose.style.display = "none";
    } else {
        eyeOpen.style.display = "none";
        eyeClose.style.display = "inline";
    }
}
document.getElementById("form").addEventListener("submit", function (event) {
    alert("Form submitted successfully!");
    location.reload();
});

validateForm();

