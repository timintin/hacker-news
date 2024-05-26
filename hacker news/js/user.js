"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  const username = $("#login-username").val();
  const password = $("#login-password").val();

  try {
    currentUser = await User.login(username, password);
    $loginForm.trigger("reset");
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  } catch (err) {
    console.error("Failed to login", err);
    alert("Failed to login. Please check your username and password.");
  }
}

$loginForm.on("submit", login);

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  try {
    currentUser = await User.signup(username, password, name);
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
    $signupForm.trigger("reset");
  } catch (err) {
    console.error("Failed to sign up", err);
    alert("Failed to sign up. Username may already be taken.");
  }
}

$signupForm.on("submit", signup);

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  currentUser = await User.loginViaStoredCredentials(token, username);
}

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}
