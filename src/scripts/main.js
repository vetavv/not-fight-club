import "./../styles/fonts.css";
import "./../styles/vars.css";
import "./../styles/general.css";
import "./../assets/favicon.ico";
import Game from "./game.js";
import { EVENTS } from "./gameConstants.js";
import { enemies, heroes } from "./heroes.js";
import {
  activateNavBtn,
  switchOverBlocks,
  updateBattleBlock,
  updateProfile,
  setActiveCharacter,
  fillForm,
  openModal,
  closeModal,
} from "./gameView.js";

import { render, saveFormData, validateForm } from "./gameControllers.js";
import {
  navProfile,
  navHome,
  navSettings,
  changeBtn,
  startBtn,
  form,
  profileBlock,
  startBlock,
  chooseEnemyBlock,
  chooseHeroBlock,
  heroesList,
  enemiesList,
  heroImgBattle,
  enemyImgBattle,
  heroLifeBattle,
  enemyLifeBattle,
  authForm,
  auth,
  profileName,
  winModalBtn,
  loseModalBtn,
  modalCloseBtns,
  modals,
  navBtns,
  changeNameBtn,
  page,
  chooseEnemyBtn,
} from "./domElements.js";
import { initGameUI } from "./gameControllers.js";

// init game
const game = new Game();
initGameUI(game);
render(game);

// for chrome bag with custom cursor
document.querySelector("main").addEventListener("mouseenter", () => {
  document.body.style.cursor =
    'url("./../assets/images/decor/cursor.png"), auto';
});

// listeners
navProfile.addEventListener("click", (e) => {
  if (!game.name) {
    openModal(auth);
    authForm.username.focus();
    auth.dataset.btnid = e.target.getAttribute("id");
  } else {
    switchOverBlocks(profileBlock);
    activateNavBtn(e.target);
  }
});

navHome.addEventListener("click", (e) => {
  switchOverBlocks(startBlock);
  activateNavBtn(e.target);
});

navSettings.addEventListener("click", (e) => {
  if (!game.name) {
    openModal(auth);
    authForm.username.focus();
    auth.dataset.btnid = e.target.getAttribute("id");
  } else {
    switchOverBlocks(chooseHeroBlock, chooseEnemyBlock);
    activateNavBtn(e.target);
  }
});

changeBtn.addEventListener("click", (e) => {
  switchOverBlocks(profileBlock, chooseHeroBlock);
  activateNavBtn(navProfile);
});

startBtn.addEventListener("click", (e) => {
  if (!game.name) {
    openModal(auth);
    authForm.username.focus();
    auth.dataset.btnid = e.target.getAttribute("id");
  } else {
    game.transition(EVENTS.START_CLICKED);
    render(game);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveFormData(form, game);
  game.transition(EVENTS.FORM_SUBMIT);
  render(game);
});

form.addEventListener("input", () => {
  validateForm(form, game.hero.data);
});

heroesList.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) {
    game.hero.data = heroes[card.id];
    setActiveCharacter(heroesList, game.hero.data.id);
    updateProfile(game.hero.data);
    updateBattleBlock(heroImgBattle, heroLifeBattle, game.hero.data);
    fillForm(form, game.hero.data, game.enemy.data);
  }
});

enemiesList.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) {
    game.enemy.data = enemies[card.id];
    setActiveCharacter(enemiesList, game.enemy.data.id);
    updateBattleBlock(enemyImgBattle, enemyLifeBattle, game.enemy.data);
    fillForm(form, game.hero.data, game.enemy.data);
  }
});

changeNameBtn.addEventListener("click", () => {
  openModal(auth);
  authForm.username.focus();
  auth.dataset.btnid = "";
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  game.name = e.target.authName.value;
  profileName.textContent = game.name;
  closeModal(auth);
  if (auth.dataset.btnid === "start") {
    chooseEnemyBlock.classList.add("wide");
    switchOverBlocks(chooseEnemyBlock);
  } else {
    try {
      const btn = document.querySelector(`#${auth.dataset.btnid}`);
      if (btn) {
        btn.click();
      }
    } catch {}
  }

  e.target.authName.value = "";
});

authForm.addEventListener("input", (e) => {
  const value = authForm.username.value;
  const valid = /^[A-Za-z0-9._-]*$/.test(value);
  if (!valid) {
    authForm.classList.add("error");
    authForm.username.value = value.replace(/[^A-Za-z0-9._-]/g, "");
  } else {
    authForm.classList.remove("error");
  }
  authForm.username.value = authForm.username.value.toLowerCase();
});

winModalBtn.addEventListener("click", (e) => {
  const modal = e.target.closest(".modal");
  game.transition(EVENTS.RESULT_CONFIRMED);
  render(game);
  switchOverBlocks(profileBlock);
  closeModal(modal);
});

loseModalBtn.addEventListener("click", (e) => {
  const modal = e.target.closest(".modal");
  game.transition(EVENTS.RESULT_CONFIRMED);
  render(game);
  switchOverBlocks(profileBlock);
  closeModal(modal);
});

modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    if (modal) {
      authForm.username.value = "";
      closeModal(modal);
    }
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (!e.target.closest(".modal-content")) {
      closeModal(modal);
    }
  });
});

chooseEnemyBtn.addEventListener("click", (e) => {
  chooseEnemyBlock.classList.remove("wide");
  game.transition(EVENTS.START_CLICKED);
  render(game);
});
