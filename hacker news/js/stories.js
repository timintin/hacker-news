"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const showFavorite = Boolean(currentUser);
  const showDelete = Boolean(currentUser && currentUser.username === story.username);

  return $(`
      <li id="${story.storyId}">
        ${showFavorite ? getFavoriteHTML(story) : ""}
        ${showDelete ? getDeleteHTML() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getFavoriteHTML(story) {
  const isFavorite = currentUser.favorites.some(s => s.storyId === story.storyId);
  const starType = isFavorite ? "fas" : "far";

  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>`;
}

function getDeleteHTML() {
  return `
    <span class="trash">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function toggleStoryFavorite(evt) {
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(storyId);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(storyId);
    $tgt.closest("i").toggleClass("fas far");
  }
}

async function deleteStory(evt) {
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);
  $closestLi.remove();
}

$allStoriesList.on("click", ".star", toggleStoryFavorite);
$allStoriesList.on("click", ".trash", deleteStory);

async function submitNewStory(evt) {
  console.debug("submitNewStory", evt);
  evt.preventDefault();

  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();
  const newStory = { title, author, url };

  const story = await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $("#new-story-form").trigger("reset");
  hidePageComponents();
  putStoriesOnPage();
}

$("#new-story-form").on("submit", submitNewStory);
