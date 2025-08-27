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
  console.log(game.state);
  switch (game.state) {
    case STATES.IDLE:
      game.hero.currentLife = game.hero.info.life;
      game.enemy.currentLife = game.enemy.info.life;

      dom.heroLog.textContent = "";
      dom.enemyLog.textContent = "";
      game.hero.currentAttackZones = [];
      game.hero.currentDefenseZones = [];

      dom.statWins.textContent = game.wins;
      dom.statFails.textContent = game.fails;

      break;

    case STATES.READY:
      resetEnemyMove(game);
      view.fillForm(game.hero, game.enemy.info);
      validateForm(dom.form, game.hero.info, game.state);
      updateLifeBars(game);
      view.switchOverBlocks(NAV_MAP["battle"]);
      changeCharacterState(dom.heroImgBattle, game.hero.info.dirname, "idle");
      changeCharacterState(dom.enemyImgBattle, game.enemy.info.dirname, "idle");
      break;

    case STATES.FIGHT:
      generateEnemyMove(game);
      calcLifes(game);
      updateLifeBars(game);

      if (game.hero.currentLife <= 0) {
        game.fails += 1;
        dom.formBtn.setAttribute("disabled", "disabled");
        dom.statFails.textContent = game.fails;
        game.transition(EVENTS.RESULT_DEAD);
        render(game);
      } else if (game.enemy.currentLife <= 0) {
        game.wins += 1;
        dom.formBtn.setAttribute("disabled", "disabled");
        dom.statWins.textContent = game.wins;

        game.transition(EVENTS.RESULT_DEAD);
        render(game);
      } else {
        game.transition(EVENTS.RESULT_ALIVE);
        render(game);
      }
      game.updateLocalStorage();

      break;

    case STATES.FINISH:
      view.switchOverBlocks(NAV_MAP["battle"]);
      updateLifeBars(game);
      if (game.hero.currentLife === 0) {
        changeCharacterState(dom.heroImgBattle, game.hero.info.dirname, "dead");
        dom.heroImgBattle.addEventListener(
          "animationend",
          () => {
            view.openModal(dom.loseModal);
          },
          { once: true }
        );
        dom.formBtn.setAttribute("disabled", "disabled");
      } else {
        changeCharacterState(
          dom.enemyImgBattle,
          game.enemy.info.dirname,
          "dead"
        );
        dom.enemyImgBattle.addEventListener(
          "animationend",
          () => {
            view.openModal(dom.winModal);
          },
          { once: true }
        );
        dom.formBtn.setAttribute("disabled", "disabled");
      }
      break;
    default:
      break;
  }
}

function changeCharacterState(domImg, dirname, state) {
  domImg.classList = "character__img";
  switch (state) {
    case "idle":
      domImg.style.backgroundImage = `url('./assets/images/heroes/${dirname}/Idle.png')`;
      domImg.classList.add("idle");
      break;
    case "dead":
      domImg.style.backgroundImage = `url('./assets/images/heroes/${dirname}/Death.png')`;
      domImg.classList.add("dead");
      break;
    default:
      break;
  }
}

export function initGameUI(game) {
  view.fillList(dom.heroesList, heroes);
  view.fillList(dom.enemiesList, enemies);
  updateDomName(game.hero.name);
  view.setActiveCharacter(dom.heroesList, game.hero.info.id);
  view.setActiveCharacter(dom.enemiesList, game.enemy.info.id);
  updateDomHeroInfo(game);
  updateDomEnemyInfo(game);
  view.switchOverBlocks(NAV_MAP["home"]);
}

export function saveFormData(form, game) {
  const data = new FormData(form);
  const defenseZones = data.getAll("defense");
  const attackZones = data.getAll("attack");

  game.hero.currentDefenseZones = defenseZones;
  game.hero.currentAttackZones = attackZones;
}

export function validateForm(form, hero, state) {
  const btn = form.querySelector("button[type=submit]");
  btn.toggleAttribute(
    "disabled",
    !isFormValid(
      hero.attackZonesCount,
      hero.defenseZonesCount,
      dom.attackZones,
      dom.defenseZones,
      state
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

  view.fillForm(game.hero, game.enemy.info);
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

  view.fillForm(game.hero, game.enemy.info);

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
