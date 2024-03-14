const loginForm = document.getElementById("login-form").value;
const loginButton = document.getElementById("login-button");
const error = document.getElementById("error-message")
const url = "https://michaelvail.github.io/success.html"

function Authenticate()
{
  if (document.getElementById("username").value === "csci325" && document.getElementById("password").value === "security") {
    window.location.href = url;
  }
  else {
    error.style.opacity = 1;
  }
}