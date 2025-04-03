document.getElementById("show-signup").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
});

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Dummy check (Replace with actual backend authentication)
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;

    if (email && password) {
        alert("Login Successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials!");
    }
});

document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (email && password) {
        alert("Signup successful! Please login.");
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    } else {
        alert("Please enter valid details.");
    }
});

document.getElementById("admin-login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    // Dummy admin check (Replace with real authentication logic)
    if (email === "admin@echoaltar.com" && password === "admin123") {
        alert("Admin Login Successful!");
        window.location.href = "index.html?admin=true"; // Pass admin flag
    } else {
        alert("Invalid Admin Credentials!");
    }
});
