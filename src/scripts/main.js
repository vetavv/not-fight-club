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
} from "./domElements.js";
import { initGameUI } from "./gameControllers.js";

// init game
const game = new Game();
initGameUI(game);
render(game);

// listeners
navProfile.addEventListener("click", (e) => {
  switchOverBlocks(profileBlock);
  activateNavBtn(e.target);
});

navHome.addEventListener("click", (e) => {
  switchOverBlocks(startBlock);
  activateNavBtn(e.target);
});

navSettings.addEventListener("click", (e) => {
  switchOverBlocks(chooseHeroBlock, chooseEnemyBlock);
  activateNavBtn(e.target);
});

changeBtn.addEventListener("click", (e) => {
  switchOverBlocks(profileBlock, chooseHeroBlock);
  activateNavBtn(navProfile);
});

startBtn.addEventListener("click", (e) => {
  if (!game.name) {
    openModal(auth);
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

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  game.name = e.target.authName.value;
  profileName.textContent = game.name;
  closeModal(auth);
  game.transition(EVENTS.START_CLICKED);
  render(game);
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
