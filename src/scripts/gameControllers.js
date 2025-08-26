import { enemies, heroes } from "./heroes.js";
import {
  fillList,
  setActiveCharacter,
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
import { STATES, EVENTS, NAV_MAP } from "./gameConstants.js";
import {
  startBlock,
  figthBlock,
  form,
  formBtn,
  heroLifeBar,
  enemyLifeBar,
  heroLifeBattle,
  enemyLifeBattle,
  enemyCurrentValue,
  heroCurrentValue,
  winModal,
  loseModal,
  enemyNameBattle,
  heroLog,
  enemyLog,
  defenseInfo,
  attackInfo,
  authForm,
} from "./domElements.js";

import * as dom from "./domElements.js";
import * as view from "./gameView.js";

export function render(game) {
  console.log(game);
  switch (game.state) {
    case STATES.IDLE:
      fillForm(game.hero.info, game.enemy.info);
      updateLifeBar(heroLifeBar, game.hero.currentLife, game.hero.info.life);
      updateLifeBar(enemyLifeBar, game.enemy.currentLife, game.enemy.info.life);
      heroLifeBattle.textContent = game.hero.info.life;
      enemyLifeBattle.textContent = game.enemy.info.life;
      enemyCurrentValue.textContent = game.enemy.currentLife;
      heroCurrentValue.textContent = game.hero.currentLife;
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
        updateLifeBar(heroLifeBar, game.hero.currentLife, game.hero.info.life);
        heroCurrentValue.textContent = game.hero.currentLife;
      } else {
        game.wins += 1;
        openModal(winModal);
        updateLifeBar(
          enemyLifeBar,
          game.enemy.currentLife,
          game.enemy.info.life
        );
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

  updateDomHeroInfo(game);
  updateDomEnemyInfo(game);

  heroCurrentValue.textContent = game.hero.currentLife;
  enemyCurrentValue.textContent = game.enemy.currentLife;
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

export function handleNavClick(navBtn, game) {
  if (game.state === STATES.READY || game.state === STATES.FIGHT) {
    view.openModal(dom.warning);
  } else if (game.state === STATES.FINISH) {
    game.transition(EVENTS.EXIT_BATTLE);
    render(game);
  }

  if (game.state === STATES.FINISH || game.state === STATES.IDLE) {
    const blocks = NAV_MAP[navBtn.dataset.navTo];
    view.switchOverBlocks(...blocks);
    view.activateNavBtn(navBtn);
  }
}

export function handleResultModalBtn(e, game) {
  const modal = e.target.closest(".modal");
  const blocks = NAV_MAP["profile"];

  view.closeModal(modal);
  view.switchOverBlocks(...blocks);

  game.transition(EVENTS.EXIT_BATTLE);
  render(game);
}

export function validateUsernameInput(input, errorEl, form) {
  let value = input.value;
  const valid = /^[A-Za-z0-9._-\s]*$/.test(value);

  if (!valid && value.length <= 15) {
    form.classList.add("error");
    errorEl.textContent =
      'Please use only English letters, numbers, "-", "." or "_"';
    input.value = value.replace(/[^A-Za-z0-9._-\s]/g, "");
  } else if (value.length > 15) {
    form.classList.add("error");
    errorEl.textContent = "Username must be 15 characters or fewer.";
    input.value = value.slice(0, 15);
  } else {
    form.classList.remove("error");
  }

  input.value = input.value.toLowerCase();
}

export function updateDomName(newName) {
  dom.names.forEach((name) => {
    name.textContent = newName;
  });
}

export function activateAuthorization(prevNavBtn) {
  const modal = dom.auth;
  const input = dom.authForm.username;

  modal.dataset.navTo = prevNavBtn.dataset.navTo;
  view.openModal(modal);
  input.focus();
}

export function updateDomEnemyInfo(game) {
  dom.enemyImages.forEach((enemyImage) => {
    enemyImage.style.backgroundImage = `url('./assets/images/heroes/${game.enemy.info.dirname}/Idle.png')`;
  });

  dom.enemyNames.forEach((enemyName) => {
    enemyName.textContent = game.enemy.info.name;
  });

  dom.enemyLifes.forEach((enemyLife) => {
    enemyLife.textContent = game.enemy.info.life;
  });

  dom.enemyCurrentValue.textContent = game.enemy.currentLife;

  dom.enemyAttackPowers.forEach((enemyAttackPower) => {
    enemyAttackPower.textContent = game.enemy.info.attackZonesCount;
  });

  dom.enemyDefensePowers.forEach((enemyDefensePower) => {
    enemyDefensePower.textContent = game.enemy.info.defenseZonesCount;
  });

  view.fillForm(game.hero.info, game.enemy.info);
}

export function updateDomHeroInfo(game) {
  dom.heroImages.forEach((heroImage) => {
    heroImage.style.backgroundImage = `url('./assets/images/heroes/${game.hero.info.dirname}/Idle.png')`;
  });

  dom.heroNames.forEach((heroName) => {
    heroName.textContent = game.hero.info.name;
  });

  dom.heroLifes.forEach((heroLife) => {
    heroLife.textContent = game.hero.info.life;
  });

  dom.heroCurrentValue.textContent = game.hero.currentLife;

  dom.heroAttackPowers.forEach((heroAttackPower) => {
    heroAttackPower.textContent = game.hero.info.attackZonesCount;
  });

  dom.heroDefensePowers.forEach((heroDefensePower) => {
    heroDefensePower.textContent = game.hero.info.defenseZonesCount;
  });

  view.fillForm(game.hero.info, game.enemy.info);

  const hint = (num) => `Please choose ${num} zone${num > 1 ? "s" : ""}`;
  dom.defenseInfo.textContent = hint(game.hero.info.defenseZonesCount);
  dom.attackInfo.textContent = hint(game.hero.info.attackZonesCount);
}
