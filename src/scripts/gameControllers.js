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
  console.log(game);
  switch (game.state) {
    case STATES.IDLE:
      fillForm(form, game.hero.info, game.enemy.info);
      updateLifeBar(heroLifeBar, game.hero.currentLife, game.hero.info.life);
      updateLifeBar(enemyLifeBar, game.enemy.currentLife, game.enemy.info.life);
      heroLifeBattle.textContent = game.hero.info.life;
      enemyLifeBattle.textContent = game.enemy.info.life;
      enemyLifeValue.textContent = game.enemy.currentLife;
      heroLifeValue.textContent = game.hero.currentLife;
      heroLog.textContent = "";
      enemyLog.textContent = "";
      defenseInfo.textContent = `Please choose ${
        game.hero.info.defenseZonesCount
      } zone${game.hero.info.defenseZonesCount > 1 ? "s" : ""}`;
      attackInfo.textContent = `Please choose ${
        game.hero.info.attackZonesCount
      } zone${game.hero.info.attackZonesCount > 1 ? "s" : ""}`;
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
      // console.log(game.state);
      // render(game);
      break;
    default:
      break;
  }
}

export function initGameUI(game) {
  fillList(heroesList, heroes);
  fillList(enemiesList, enemies);

  setActiveCharacter(heroesList, game.hero.info.id);
  setActiveCharacter(enemiesList, game.enemy.info.id);

  updateProfile(game.hero.info);

  updateBattleBlock(heroImgBattle, heroLifeBattle, game.hero.info);
  updateBattleBlock(enemyImgBattle, enemyLifeBattle, game.enemy.info);

  heroLifeValue.textContent = game.hero.currentLife;
  enemyLifeValue.textContent = game.enemy.currentLife;
  enemyNameBattle.textContent = game.enemy.info.name;
  validateForm(form, game.hero.info);
  switchOverBlocks(startBlock);
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
  game.hero.currentLife = game.hero.info.life;
  game.enemy.currentLife = game.enemy.info.life;
}
