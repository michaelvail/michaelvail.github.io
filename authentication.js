const loginForm = document.getElementById("login-form").value;
const loginButton = document.getElementById("login-button").value;
const error = document.getElementById("error-message")
const url = "https://michaelvail.github.io/success.html"

loginButton.addEventListener(loginButton, (e) => {
  e.preventDefault();
  if (document.getElementById("username").value === "csci325" && document.getElementById("password").value === "security") {
    window.location.href = url;
  }
  else {
    error.style.opacity = 1;
  }
})