const maxContentLength = 1024;
const power = document.getElementById("power-point");
const submitButton = document.getElementById("submit");

const Theme = {
    LIGHT: "light",
    DARK: "dark",
}

function toggleDarkMode() {
    var element = document.body;
    element.classList.toggle(Theme.DARK);

    if (element.classList.contains(Theme.DARK)) {
        localStorage.setItem("theme", Theme.DARK);
    } else {
        localStorage.setItem("theme", Theme.LIGHT);
    }
}

window.onload = function () {
    const savedTheme = localStorage.getItem("theme");
    const toggleSwitch = document.getElementById("toggle");
    if (savedTheme === Theme.DARK) {
        document.body.classList.add(Theme.DARK);
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
    state: "state",
    password: "password",
    confPassword: "confPassword",
}

const errors = {
    name: "nameErr",
    email: "emailErr",
    phone: "phoneErr",
    age: "ageErr",
    state: "stateErr",
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

function setValidationClasses(field, isValid) {
    if (isValid) {
        field.classList.remove("invalid");
        field.classList.add("valid");
    } else {
        field.classList.remove("valid");
        field.classList.add("invalid");
    }
}

function validateName(event) {
    const nameField = event.currentTarget;
    const name = nameField.value.trim();
    const nameErr = document.getElementById(errors.name);

    if (name.length > maxContentLength) {
        nameErr.innerHTML = "*Name must be less than 1024 characters";
        setValidationClasses(nameField, false);
        submitButton.disabled = true;
        return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {    
        nameErr.innerHTML = "*Only alphabets are allowed.";     
        setValidationClasses(nameField, false);     
        submitButton.disabled = true;
        return false;
    }
    if (name.length < 3) {
        nameErr.innerHTML = "*Length should be greater than 3."; 
        setValidationClasses(nameField, false);
        submitButton.disabled = true;
        return false;
    }else{
        nameErr.innerHTML = "";
        setValidationClasses(nameField, true); 
        submitButton.disabled = false;
        return true;
    }
}

function validateEmail(event) {
    const emailField = event.currentTarget;
    const email = emailField.value.trim();
    const emailErr = document.getElementById(errors.email);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        emailErr.innerHTML = "*Invalid Email Address.";
        setValidationClasses(emailField, false);
        submitButton.disabled = true;
        return false;
    }else{
        emailErr.innerHTML = "";
        setValidationClasses(emailField, true);
        submitButton.disabled = false;
        return true;
    } 
}

function validatePhone(event) {
    const phoneField = event.currentTarget;
    const phone = phoneField.value.trim();
    const phoneErr = document.getElementById(errors.phone);

    if (!/^\d{10}$/.test(phone)) {
        phoneErr.innerHTML = "*Phone number must be exactly 10 digits.";
        setValidationClasses(phoneField, false);
        submitButton.disabled = true;
        return false;
    }else{
        phoneErr.innerHTML = "";
        setValidationClasses(phoneField, true);
        submitButton.disabled = false;
        return true;
    } 
}

function validateAge(event) {
    const ageField = event.currentTarget;
    const age = ageField.value.trim();
    const ageErr = document.getElementById(errors.age);

    if (age < 1 || age > 100) {
        ageErr.innerHTML = "*Age should be between 1 and 100.";
        setValidationClasses(ageField, false);
        submitButton.disabled = true;
        return false;
    }else{
        ageErr.innerHTML = "";
        setValidationClasses(ageField, true);
        submitButton.disabled = false;
        return true;
    } 
}

function validateState(event) {
    const stateField = event.currentTarget;
    const state = stateField.value;
    const stateErr = document.getElementById(errors.state);
    if (state === "") {
        stateErr.innerHTML = "*Please select a state.";
        setValidationClasses(stateField, false);
        submitButton.disabled = true;
        return false;
    }else{
        stateErr.innerHTML = "";
        setValidationClasses(stateField, true);
        submitButton.disabled = false;
        return true;
    }  
}

function validatePassword(event) {
    const passwordField = event.currentTarget;
    const password = passwordField.value;
    const passErr = document.getElementById(errors.password);
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    if (password.length < 6) {
        passErr.innerHTML = "*Password should be at least 6 characters.";
        power.style.width = widthPower[0];
        power.style.backgroundColor = colorPower[0];
        setValidationClasses(passwordField, false);
        submitButton.disabled = true;
        return false;
    }

    if (password.length > maxContentLength) {
        passErr.textContent = "*Password must be less than 1024 characters";
        setValidationClasses(passwordField, false);
        submitButton.disabled = true;
        return false;
    }

    else{
        let point = 0;
        passErr.innerHTML = "";
        const arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
        arrayTest.forEach((regex) => {
            if (regex.test(password)) point += 1;
        });
        power.style.width = widthPower[point];
        power.style.backgroundColor = colorPower[point];
        setValidationClasses(passwordField, true);
        submitButton.disabled = false;
        return true;
    }   
}

function validateConfirmPassword(event) {
    const passwordField = document.getElementById("password");
    const confPasswordField = event.currentTarget;
    const password = passwordField.value;
    const confPassword = confPasswordField.value;
    const confPassErr = document.getElementById(errors.confPassword);

    if (confPassword !== password) {
        confPassErr.innerHTML = "*Passwords do not match.";
        setValidationClasses(confPasswordField, false);
        submitButton.disabled = true;
        return false;
    }else{
        confPassErr.innerHTML = "";
        setValidationClasses(confPasswordField, true);
        submitButton.disabled = false;
        return true;
    }   
}

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

function submitForm(event){
    const stateField = document.getElementById(fields.state);
    const state = stateField.value;
    const stateErr = document.getElementById(errors.state);
    if (state === "") {
        stateErr.innerHTML = "*Please select a state.";
        setValidationClasses(stateField, false);
        event.preventDefault();
    } else {
        alert("Form submitted successfully!");
        location.reload();
    }
}

