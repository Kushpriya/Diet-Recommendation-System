document.getElementById("signup-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        var agreeCheckbox = document.getElementById("terms");
        if (!agreeCheckbox.checked) {
          alert('You must agree to the terms and conditions before signing up.');
        } else {
          validateSignup(event); // Call the validateSignup function if terms are agreed
        }
      });

      function validateSignup(event) {
        var username = document.getElementById("signup-username").value.trim();
        var email = document.getElementById("signup-email").value.trim();
        var password = document.getElementById("signup-password").value.trim();
        var confirmPassword = document.getElementById("signup-confirm-password").value.trim();

        var regxUsername = /^[A-Za-z0-9._-]{3,20}$/;
        var regxEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        var regxPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

        var isValid = true;

        if (!regxUsername.test(username)) {
          document.getElementById('usernameError').innerHTML = "Username is invalid";
          isValid = false;
        } else {
          document.getElementById('usernameError').innerHTML = "";
        }

        if (!regxEmail.test(email)) {
          document.getElementById('emailError').innerHTML = "Email is invalid";
          isValid = false;
        } else {
          document.getElementById('emailError').innerHTML = "";
        }

        if (!regxPassword.test(password)) {
          document.getElementById('passwordError').innerHTML = "Password is invalid";
          isValid = false;
        } else {
          document.getElementById('passwordError').innerHTML = "";
        }

        if (password !== confirmPassword) {
          document.getElementById('confirmPasswordError').innerHTML = "Passwords do not match";
          isValid = false;
        } else {
          document.getElementById('confirmPasswordError').innerHTML = "";
        }

        if (isValid) {
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userPassword', password);
          alert("New account created successfully. You can now log in.");
          window.location.href = '/login'; // Redirect to the login page
        }
      }

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

      document.getElementById("icon-close").addEventListener("click", function() {
        window.location.href = "/"; // Redirect to home page
      });