const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const error = document.getElementById("error-message")
const url = "https://michaelvail.github.io/success.html"

loginButton.addEventListener("login", (e) => {
  e.preventDefault();
  if (document.getElementById("username") == "csci325" && document.getElementById("password") == "security") {
    window.location.href = url;
  }
  else {
    error.style.opacity = 1;
  }
})