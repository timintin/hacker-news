"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $newStoryForm = $("#new-story-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $newStoryForm
  ];
  components.forEach(c => c.hide());
}

async function start() {
  console.debug("start");

  hidePageComponents();  // Ensure all components are hidden initially

  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  if (currentUser) updateUIOnUserLogin();
}

$(start);
