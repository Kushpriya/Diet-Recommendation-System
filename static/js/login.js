function validateLogin(event) {
    event.preventDefault();

    var email = document.getElementById("login-email").value.trim();
    var password = document.getElementById("login-password").value.trim();

    var regxEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    var isValid = true;

    if (regxEmail.test(email)) {
        document.getElementById("emailError").innerHTML = "";
    } else {
        document.getElementById("emailError").innerHTML = "Email is invalid";
        isValid = false;
    }

    if (password.length >= 8) { // Basic check for password length
        document.getElementById("passwordError").innerHTML = "";
    } else {
        document.getElementById("passwordError").innerHTML = "Password is too short";
        isValid = false;
    }

    if (isValid) {
        handleLogin(email, password);
    }
}

function handleLogin(email, password) {
    var storedEmail = localStorage.getItem('userEmail');
    var storedPassword = localStorage.getItem('userPassword');

    if (email === storedEmail && password === storedPassword) {
        alert("Login successful!");
        window.location.href = "/"; 
    } else {
        alert("Incorrect Email or Password");
    }
}

document.getElementById("login-form").addEventListener("submit", validateLogin);

function togglePassword(passwordFieldId) {
    var passwordField = document.getElementById(passwordFieldId);
    var toggleIcon = passwordField.nextElementSibling.querySelector("ion-icon");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.setAttribute("name", "eye");
    } else {
        passwordField.type = "password";
        toggleIcon.setAttribute("name", "eye-off");
    }
}

