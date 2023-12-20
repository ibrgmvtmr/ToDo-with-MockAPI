/*** 
    Script for handling user sign-up on the sign-up page.
    - Sends a POST request to MockAPI to create a new user.
    - Displays success/error messages based on the API response.
    - Logs user data to the console on successful sign-up.
    - Displays a SweetAlert notification on successful sign-up.
***/

document.addEventListener("DOMContentLoaded", function () {
    // Select sign-up button
    const signUpButton = document.querySelector(".btn-primary");

    // Add click event listener to sign-up button
    signUpButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Get entered username and password for sign-up
        const signUpUserName = document.querySelector('input[name="SignUpUserName"]').value;
        const signUpPassword = document.querySelector('input[name="SignUpPassword"]').value;

        // Create data object for POST request
        const postData = {
            username: signUpUserName,
            password: signUpPassword
        };

        // Send POST request to create a new user
        fetch("https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            // Log the API response
            console.log(data);

            // Display success message and fetch user data by ID
            if (data.id) {
                // Display success message using SweetAlert
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Sign-up successful!",
                    showConfirmButton: false,
                    timer: 1500
                });

                return fetch(`https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users/${data.id}`);
            } else {
                // Display error message on sign-up failure
                alert("Sign-up failed. Please try again.");
            }
        })
        .then(response => response.json())
        .then(user => {
            // Log user data by ID to the console
            console.log("User by ID:", user);
        })
        .catch(error => console.error("Error fetching data:", error));
    });
});
