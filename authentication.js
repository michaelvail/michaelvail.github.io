const error = document.getElementById("error-message")

function Authenticate()
{
  if (document.getElementById("username").value === "csci325" && document.getElementById("password").value === "security") {
    window.location.href = "https://michaelvail.github.io/success.html";
  }
  else {
    error.style.opacity = 1;
  }
}