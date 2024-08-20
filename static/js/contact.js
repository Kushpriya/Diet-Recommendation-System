document.addEventListener('DOMContentLoaded', function () {
    // Initialize EmailJS
    emailjs.init('zCNFY57nvBrhwL00I');

    const form = document.getElementById('contactForm');
    const thankYouMessage = document.getElementById('thank-you-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); 

        emailjs.sendForm('service_v3qup4u', 'template_qcc5lij', form)
            .then((response) => {
                console.log('Success:', response);
                thankYouMessage.textContent = "Thanks for contacting Me!! 😊";
                thankYouMessage.className = 'success'; 
                form.reset(); 
            })
            .catch((error) => {
                console.error('Failed:', error);
                thankYouMessage.textContent = "There was an error sending your message. Please try again.";
                thankYouMessage.className = 'error'; 
            });
    });
});


// function validateForm() {
//     var name = document.getElementById("name").value.trim();
//     var email = document.getElementById("email").value.trim();
//     var address = document.getElementById("address").value.trim();
//     var message = document.getElementById("message").value.trim();

//     var regx_name = /^([a-zA-Z]{3,30}\s*)+$/;
//     var regx_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     var regx_address = /^[A-Z a-z0-9\s,.'-]{3,}$/;

//     // Clear previous error messages
//     document.getElementById("name_error").innerHTML = "";
//     document.getElementById("email_error").innerHTML = "";
//     document.getElementById("address_error").innerHTML = "";

//     if (name === "" || email === "" || address === "" || message === "") {
//         alert("All fields are required.");
//         return false;
//     }

//     if (!regx_name.test(name)) {
//         document.getElementById("name_error").innerHTML = "Name is invalid";
//         return false;
//     }

//     if (!regx_email.test(email)) {
//         document.getElementById("email_error").innerHTML = "Email is invalid";
//         return false;
//     }

//     if (!regx_address.test(address)) {
//         document.getElementById("address_error").innerHTML = "Address is invalid";
//         return false;
//     }

//     alert("Form Submitted Successfully");
//     window.location.href = '/'; 
//     return false;
// }
