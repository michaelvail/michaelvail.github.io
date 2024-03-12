const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const error = document.getElementById("error-message")
const location = "success.html"

loginButton.addEventListener("login", (e) => {
  //e.preventDefault();
  if (username == "csci325" && password == "security") {
    location.reload();
    location.assign()
  }
  else {
    error.style.opacity = 1;
  }
})