const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const ageField = document.getElementById("age");
const passwordField = document.getElementById("password");
const confPasswordField = document.getElementById("confPassword");
const power = document.getElementById("power-point");
const submitButton = document.querySelector('button[type="submit"]');
function toggleDarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
function clearContent() {
    const fields = [nameField, emailField, phoneField, ageField, passwordField, confPasswordField];
    const errors = ["nameErr", "emailErr", "phoneErr", "ageErr", "passErr", "confPassErr"];
    fields.forEach((field, index) => {
        field.classList.remove("invalid");
        field.classList.remove("valid");
        document.getElementById(errors[index]).innerHTML = "";
    });
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

function validateName() {
    if (!touchedFields.name) return true;
    const name = nameField.value.trim();
    const nameErr = document.getElementById("nameErr");

    if (name.length > 1024) {
        nameErr.textContent = "*Name must be less than 1024 characters";
        nameField.classList.remove("valid");
        nameField.classList.add("invalid");
        return false;
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
        nameErr.innerHTML = "*Only alphabets are allowed.";
        nameField.classList.remove("valid");
        nameField.classList.add("invalid");
        return false;
    }
    if (name.length < 3) {
        nameErr.innerHTML = "*Length should be greater than 3.";
        nameField.classList.remove("valid");
        nameField.classList.add("invalid");
        return false;
    }
    nameErr.innerHTML = "";
    nameField.classList.remove("invalid");
    nameField.classList.add("valid");
    return true;
}

function validateEmail() {
    if (!touchedFields.email) return true;
    const email = emailField.value.trim();
    const emailErr = document.getElementById("emailErr");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailErr.innerHTML = "*Invalid Email Address.";
        emailField.classList.remove("valid");
        emailField.classList.add("invalid");
        return false;
    }
    emailErr.innerHTML = "";
    emailField.classList.remove("invalid");
    emailField.classList.add("valid");
    return true;
}

function validatePhone() {
    if (!touchedFields.phone) return true;
    const phone = phoneField.value.trim();
    const phoneErr = document.getElementById("phoneErr");

    if (!/^\d{10}$/.test(phone)) {
        phoneErr.innerHTML = "*Phone number must be exactly 10 digits.";
        phoneField.classList.remove("valid");
        phoneField.classList.add("invalid");
        return false;
    }
    phoneErr.innerHTML = "";
    phoneField.classList.remove("invalid");
    phoneField.classList.add("valid");
    return true;
}
function validateAge() {
    if (!touchedFields.age) return true;
    const age = ageField.value.trim();
    const ageErr = document.getElementById("ageErr");

    if (age < 1 || age > 100) {
        ageErr.innerHTML = "*Age should be between 1 and 100.";
        ageField.classList.remove("valid");
        ageField.classList.add("invalid");
        return false;
    }
    ageErr.innerHTML = "";
    ageField.classList.remove("invalid");
    ageField.classList.add("valid");
    return true;
}

function validatePassword() {
    if (!touchedFields.password) return true;
    const password = passwordField.value;
    const passErr = document.getElementById("passErr");
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    if (password.length < 6) {
        passErr.innerHTML = "*Password should be at least 6 characters.";
        power.style.width = widthPower[0];
        power.style.backgroundColor = colorPower[0];
        passwordField.classList.remove("valid");
        passwordField.classList.add("invalid");
        return false;
    }

    if (password.length > 1024) {
        passErr.textContent = "*Password must be less than 1024 characters";
        passwordField.classList.remove("valid");
        passwordField.classList.add("invalid");
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
    passwordField.classList.remove("invalid");
    passwordField.classList.add("valid");
    return true;
}

function validateConfirmPassword() {
    if (!touchedFields.confPassword) return true;
    const password = passwordField.value;
    const confPassword = confPasswordField.value;
    const confPassErr = document.getElementById("confPassErr");

    if (confPassword !== password) {
        confPassErr.innerHTML = "*Passwords do not match.";
        confPasswordField.classList.remove("valid");
        confPasswordField.classList.add("invalid");
        return false;
    }
    confPassErr.innerHTML = "";
    confPasswordField.classList.remove("invalid");
    confPasswordField.classList.add("valid");
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


nameField.addEventListener("input", function () {
    touchedFields.name = true;
    validateForm();
});
emailField.addEventListener("input", function () {
    touchedFields.email = true;
    validateForm();
});
phoneField.addEventListener("input", function () {
    touchedFields.phone = true;
    validateForm();
});
ageField.addEventListener("input", function () {
    touchedFields.age = true;
    validateForm();
});
passwordField.addEventListener("input", function () {
    touchedFields.password = true;
    validateForm();
});
confPasswordField.addEventListener("input", function () {
    touchedFields.confPassword = true;
    validateForm();
});

validateForm();

