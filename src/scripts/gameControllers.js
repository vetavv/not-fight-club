import { enemies, heroes } from "./heroes.js";
import {
  fillList,
  setActiveCharacter,
  updateBattleBlock,
  updateProfile,
  switchOverBlocks,
  fillForm,
  updateLifeBar,
  openModal,
} from "./gameView.js";
import {
  resetEnemyMove,
  calcLifes,
  generateEnemyMove,
  isFormValid,
} from "./gameLogic.js";
import { STATES, EVENTS } from "./gameConstants.js";
import {
  startBlock,
  figthBlock,
  form,
  formBtn,
  heroLifeBar,
  enemyLifeBar,
  blocks,
  heroImgBattle,
  enemyImgBattle,
  heroLifeBattle,
  enemyLifeBattle,
  enemyLifeValue,
  heroLifeValue,
  winModal,
  loseModal,
  enemyNameBattle,
  heroLog,
  enemyLog,
  defenseInfo,
  attackInfo,
} from "./domElements.js";

export function render(game) {
  switch (game.state) {
    case STATES.IDLE:
      fillForm(form, game.hero.data, game.enemy.data);
      updateLifeBar(heroLifeBar, game.hero.currentLife, game.hero.data.life);
      updateLifeBar(enemyLifeBar, game.enemy.currentLife, game.enemy.data.life);
      heroLifeBattle.textContent = game.hero.data.life;
      enemyLifeBattle.textContent = game.enemy.data.life;
      enemyLifeValue.textContent = game.enemy.currentLife;
      heroLifeValue.textContent = game.hero.currentLife;
      heroLog.textContent = "";
      enemyLog.textContent = "";
      defenseInfo.textContent = `Please choose ${
        game.hero.data.defenseZonesCount
      } zone${game.hero.data.defenseZonesCount > 1 ? "s" : ""}`;
      attackInfo.textContent = `Please choose ${
        game.hero.data.attackZonesCount
      } zone${game.hero.data.attackZonesCount > 1 ? "s" : ""}`;
      switchOverBlocks(startBlock);
      break;

    case STATES.READY:
      resetEnemyMove(game);
      switchOverBlocks(figthBlock);
      break;

    case STATES.FIGHT:
      generateEnemyMove(game);
      calcLifes(game);
      if (game.hero.currentLife <= 0 || game.enemy.currentLife <= 0) {
        game.transition(EVENTS.RESULT_DEAD);
        render(game);
      } else {
        game.transition(EVENTS.RESULT_ALIVE);
        render(game);
      }
      break;

    case STATES.FINISH:
      formBtn.setAttribute("disabled", "disabled");
      console.log("finish");
      if (game.hero.currentLife === 0) {
        game.fails += 1;
        openModal(loseModal);
      } else {
        game.wins += 1;
        openModal(winModal);
      }
      document.querySelector("#statWins").textContent = game.wins;
      document.querySelector("#statFails").textContent = game.fails;
      resetRound(game);
      // game.transition(EVENTS.RESULT_CONFIRMED);
      // render(game);
      break;
    default:
      break;
  }
}

export function initGameUI(game) {
  fillList(heroesList, heroes);
  fillList(enemiesList, enemies);

  setActiveCharacter(heroesList, game.hero.data.id);
  setActiveCharacter(enemiesList, game.enemy.data.id);

  updateProfile(game.hero.data);

  updateBattleBlock(heroImgBattle, heroLifeBattle, game.hero.data);
  updateBattleBlock(enemyImgBattle, enemyLifeBattle, game.enemy.data);

  const currentLife = document.querySelector("#battleHeroCurrentLife");
  currentLife.textContent = game.hero.currentLife;
  const currentLifeEnemy = document.querySelector("#battleEnemyCurrentLife");
  currentLifeEnemy.textContent = game.enemy.currentLife;
  enemyNameBattle.textContent = game.enemy.data.name;
  validateForm(form, game.hero.data);
}

export function saveFormData(form, game) {
  const data = new FormData(form);
  const defenseZones = data.getAll("defense");
  const attackZones = data.getAll("attack");

  game.hero.currentDefenseZones = defenseZones;
  game.hero.currentAttackZones = attackZones;
}

export function validateForm(form, hero) {
  const btn = form.querySelector("button[type=submit]");
  btn.toggleAttribute("disabled", !isFormValid(form, hero));
}

export function resetRound(game) {
  game.currentAttackZones = [];
  game.currentDefenseZones = [];
  game.hero.currentLife = game.hero.data.life;
  game.enemy.currentLife = game.enemy.data.life;
}
