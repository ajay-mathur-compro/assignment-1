const maxContentLength = 1024;
const power = document.getElementById("power-point");
const submitButton = document.getElementById("submit");

const Theme = {
    LIGHT: "light",
    DARK: "dark",
}

const isFormValid = {
    name: false,
    email: false,
    phone: false,
    age: false,
    state: false,
    password: false,
    confPassword: false,
};

const errors = {
    name: "nameErr",
    email: "emailErr",
    phone: "phoneErr",
    age: "ageErr",
    state: "stateErr",
    password: "passErr",
    confPassword: "confPassErr",
};

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

function clearContent() {
    location.reload()
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
//flag 
function validateName(event) {
    const nameField = event.currentTarget;
    const name = nameField.value.trim();
    const nameErr = document.getElementById(errors.name);
    let isValid = false;

    if (name.length > maxContentLength) {
        nameErr.innerHTML = "*Name must be less than 1024 characters";
        isValid = false;
        isFormValid.name = false;
    }
    else if (name.length < 3) {
        nameErr.innerHTML = "*Length should be greater than 3."; 
        isValid = false;
        isFormValid.name = false;
    }
    else if (!/^[a-zA-Z\s]+$/.test(name)) {    
        nameErr.innerHTML = "*Only alphabets are allowed.";     
        isValid = false;
        isFormValid.name = false;
    }
    else{
        nameErr.innerHTML = "";
        isValid = true;
        isFormValid.name = true;
    }
    setValidationClasses(nameField, isValid);
    submitButton.disabled = !isValid;
    return true;
}

function validateEmail(event) {
    const emailField = event.currentTarget;
    const email = emailField.value.trim();
    const emailErr = document.getElementById(errors.email);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = false;

    if (!emailPattern.test(email)) {
        emailErr.innerHTML = "*Invalid Email Address.";
        isValid = false;
        isFormValid.email = false;
        
    }else{
        emailErr.innerHTML = "";
        isValid = true;
        isFormValid.email = true;
    } 
    setValidationClasses(emailField, isValid);
    submitButton.disabled = !isValid;
    return true;
}

function validatePhone(event) {
    const phoneField = event.currentTarget;
    const phone = phoneField.value.trim();
    const phoneErr = document.getElementById(errors.phone);
    let isValid = false;

    if (!/^\d{10}$/.test(phone)) {
        phoneErr.innerHTML = "*Phone number must be exactly 10 digits.";
        isValid = false;
        isFormValid.phone = false;
    }else{
        phoneErr.innerHTML = "";
        isValid = true;
        isFormValid.phone = true;
    } 
    setValidationClasses(phoneField, isValid);
    submitButton.disabled = !isValid;
    return true;
}

function validateAge(event) {
    const ageField = event.currentTarget;
    const age = ageField.value.trim();
    const ageErr = document.getElementById(errors.age);
    let isValid = false;

    if (age < 1 || age > 100) {
        ageErr.innerHTML = "*Age should be between 1 and 100.";
        isValid = false;
        isFormValid.age = false;
    }else{
        ageErr.innerHTML = "";
        isValid = true;
        isFormValid.age = true;
    } 
    setValidationClasses(ageField, isValid);
    submitButton.disabled = !isValid;
    return true;
}

function validateState(event) {
    const stateField = event.currentTarget;
    const state = stateField.value;
    const stateErr = document.getElementById(errors.state);
    let isValid = false;
    if (state === "") {
        stateErr.innerHTML = "*Please select a state.";
        isValid = false;
        isFormValid.state = false;
    }else{
        stateErr.innerHTML = "";
        isValid = true;
        isFormValid.state = true;
    }  
    setValidationClasses(stateField, isValid);
    submitButton.disabled = !isValid;
    return true;
}

function validatePassword(event) {
    const passwordField = event.currentTarget;
    const password = passwordField.value;
    const passErr = document.getElementById(errors.password);
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];
    let isValid = false;

    if (password.length < 6) {
        passErr.innerHTML = "*Password should be at least 6 characters.";
        power.style.width = widthPower[0];
        power.style.backgroundColor = colorPower[0];
        isValid = false;
        isFormValid.password = false;
    }

    else if (password.length > maxContentLength) {
        passErr.textContent = "*Password must be less than 1024 characters";
        isValid = false;
        isFormValid.password = false;
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
        isValid = true;
        isFormValid.password = true;
    }   
    setValidationClasses(passwordField, isValid);
    submitButton.disabled = !isValid;
    return true;
}

function validateConfirmPassword(event) {
    const passwordField = document.getElementById("password");
    const confPasswordField = event.currentTarget;
    const password = passwordField.value;
    const confPassword = confPasswordField.value;
    const confPassErr = document.getElementById(errors.confPassword);
    let isValid = false;

    if (confPassword !== password) {
        confPassErr.innerHTML = "*Passwords do not match.";
        isValid = false;
        isFormValid.confPassword = false
    }else{
        confPassErr.innerHTML = "";
        isValid = true;
        isFormValid.confPassword = true;
    }   
    setValidationClasses(confPasswordField, isValid);
    submitButton.disabled = !isValid;
    return true;
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
    event.preventDefault();
    const stateField = document.getElementById("state");
    const state = stateField.value;
    const stateErr = document.getElementById(errors.state);
    if (state === "") {
        stateErr.innerHTML = "*Please select a state.";
        setValidationClasses(stateField, false);
        return;
    } 
    for (const key in isFormValid) {
        if (!isFormValid[key]) {
            event.preventDefault();
            return;
        }
    }
    
    alert("Form submitted successfully!");
    location.reload();
    
}

