import { enemies, heroes } from "./heroes.js";
import { STATES, EVENTS, NAV_MAP } from "./gameConstants.js";
import {
  resetEnemyMove,
  calcLifes,
  generateEnemyMove,
  isFormValid,
} from "./gameLogic.js";
import * as dom from "./domElements.js";
import * as view from "./gameView.js";

export function render(game) {
  switch (game.state) {
    case STATES.IDLE:
      game.hero.currentLife = game.hero.info.life;
      game.enemy.currentLife = game.enemy.info.life;
      updateLifeBars(game);
      dom.heroLog.textContent = "";
      dom.enemyLog.textContent = "";
      game.currentAttackZones = [];
      game.currentDefenseZones = [];
      view.fillForm(game.hero.info, game.enemy.info);
      break;

    case STATES.READY:
      resetEnemyMove(game);
      view.switchOverBlocks(NAV_MAP["battle"]);
      break;

    case STATES.FIGHT:
      generateEnemyMove(game);
      calcLifes(game);
      updateLifeBars(game);
      const event =
        game.hero.currentLife <= 0 || game.enemy.currentLife <= 0
          ? EVENTS.RESULT_DEAD
          : EVENTS.RESULT_ALIVE;
      game.transition(event);
      render(game);
      break;

    case STATES.FINISH:
      dom.formBtn.setAttribute("disabled", "disabled");
      if (game.hero.currentLife === 0) {
        game.fails += 1;
        view.openModal(dom.loseModal);
      } else {
        game.wins += 1;
        view.openModal(dom.winModal);
      }
      updateLifeBars(game);
      dom.statWins.textContent = game.wins;
      dom.statFails.textContent = game.fails;
      break;
    default:
      break;
  }
}

export function initGameUI(game) {
  view.fillList(dom.heroesList, heroes);
  view.fillList(dom.enemiesList, enemies);
  view.setActiveCharacter(dom.heroesList, game.hero.info.id);
  view.setActiveCharacter(dom.enemiesList, game.enemy.info.id);
  updateDomHeroInfo(game);
  updateDomEnemyInfo(game);
  validateForm(dom.form, game.hero.info);
  view.switchOverBlocks(NAV_MAP["home"]);
  view.fillForm(game.hero.info, game.enemy.info);
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
  btn.toggleAttribute(
    "disabled",
    !isFormValid(
      hero.attackZonesCount,
      hero.defenseZonesCount,
      dom.attackZones,
      dom.defenseZones
    )
  );
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
    view.switchOverBlocks(blocks);
    view.activateNavBtn(navBtn);
  }
}

export function handleResultModalBtn(e, game) {
  const modal = e.target.closest(".modal");
  const blocks = NAV_MAP["profile"];

  view.closeModal(modal);
  view.switchOverBlocks(blocks);
  view.activateNavBtn(dom.navProfile);

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

export function updateLifeBars(game) {
  view.updateLifeBar(
    dom.heroLifeBar,
    dom.heroCurrentValue,
    game.hero.currentLife,
    game.hero.info.life
  );
  view.updateLifeBar(
    dom.enemyLifeBar,
    dom.enemyCurrentValue,
    game.enemy.currentLife,
    game.enemy.info.life
  );
}
