/*** 
    Script for handling user authentication on the login page.
    - Fetches user data from MockAPI.
    - Validates entered credentials.
    - Displays success/error messages using SweetAlert2.
    - Redirects to the to-do list page on successful login.
***/
document.addEventListener("DOMContentLoaded", function () {
    // Select submit button
    const submitButton = document.querySelector("#submitButton");

    // Add click event listener to submit button
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Get entered username and password
        const userName = document.querySelector('input[name="UserName"]').value;
        const password = document.querySelector('input[name="Password"]').value;

        // Fetch user data from MockAPI
        fetch("https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users")
            .then(response => response.json())
            .then(users => {
                // Find user with matching credentials
                const matchingUser = users.find(user => user.username === userName && user.password === password);

                // Handle login success
                if (matchingUser) {
                    // Display success message
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Login successful!",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Save user ID to local storage
                    localStorage.setItem('userId', matchingUser.id);

                    // Redirect to to-do list page after a delay
                    setTimeout(function () {
                        window.location.href = "todo_window.html";
                    }, 1500);
                } else {
                    // Handle login failure and display error message
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Login failed. Please check your username and password.",
                        footer: '<a href="#">Why do I have this issue?</a>'
                    });
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    });
});
