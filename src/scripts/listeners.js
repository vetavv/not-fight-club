import cursorImg from "./../assets/images/decor/cursor.png";

import { EVENTS, NAV_MAP } from "./gameConstants.js";
import { enemies, heroes } from "./heroes.js";
import * as view from "./gameView.js";
import * as dom from "./domElements.js";
import {
  render,
  saveFormData,
  validateForm,
  handleNavClick,
  handleResultModalBtn,
  validateUsernameInput,
  updateDomName,
  activateAuthorization,
  updateDomEnemyInfo,
  updateDomHeroInfo,
} from "./gameControllers.js";
import * as controllers from "./gameControllers.js";

export default (game) => {
  // for chrome bag with custom cursor
  document.querySelector("main").addEventListener("mouseenter", () => {
    document.body.style.cursor = `url(${cursorImg}), auto`;
  });

  dom.navProfile.addEventListener("click", (e) => {
    if (game.isAuthorized) {
      handleNavClick(e.target, game);
    } else {
      activateAuthorization(e.target);
    }
  });

  dom.navHome.addEventListener("click", (e) => {
    handleNavClick(e.target, game);
  });

  dom.navSettings.addEventListener("click", (e) => {
    if (game.isAuthorized) {
      handleNavClick(e.target, game);
    } else {
      activateAuthorization(e.target);
    }
  });

  dom.startBtn.addEventListener("click", (e) => {
    if (game.isAuthorized) {
      game.transition(EVENTS.START_CLICKED);
      render(game);
    } else {
      activateAuthorization(e.target);
    }
  });

  dom.changeBtn.addEventListener("click", (e) => {
    const blocks = NAV_MAP[e.target.dataset.navTo];
    view.switchOverBlocks(blocks);
  });

  dom.changeNameBtn.addEventListener("click", () => {
    const input = dom.authForm.username;
    const modal = dom.auth;
    view.openModal(modal);
    input.focus();
    modal.dataset.navTo = "";
  });

  dom.form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormData(form, game);
    game.transition(EVENTS.FORM_SUBMIT);
    render(game);
  });

  dom.form.addEventListener("input", () => {
    validateForm(form, game.hero.info);
  });

  dom.heroesList.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) {
      game.hero.info = heroes[card.id];
      game.hero.currentLife = game.hero.info.life;

      view.setActiveCharacter(dom.heroesList, game.hero.info.id);
      updateDomHeroInfo(game);
    }
  });

  dom.enemiesList.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) {
      game.enemy.info = enemies[card.id];
      game.enemy.currentLife = game.enemy.info.life;

      view.setActiveCharacter(dom.enemiesList, game.enemy.info.id);
      updateDomEnemyInfo(game);
    }
  });

  dom.authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const input = form.authName;
    const modal = form.closest(".modal");
    const nextPage = modal.dataset.navTo;

    game.hero.name = input.value;
    updateDomName(game.hero.name);

    view.closeModal(modal);
    input.value = "";

    game.isAuthorized = true;

    if (nextPage) {
      if (nextPage === "battle") {
        game.transition(EVENTS.START_CLICKED);
        render(game);
      } else {
        const blocks = NAV_MAP[nextPage];
        view.switchOverBlocks(blocks);
      }
    }
  });

  dom.authForm.addEventListener("input", (e) => {
    validateUsernameInput(dom.authForm.username, dom.authErr, dom.authForm);
  });

  dom.winModalBtn.addEventListener("click", (e) => {
    handleResultModalBtn(e, game);
  });

  dom.loseModalBtn.addEventListener("click", (e) => {
    handleResultModalBtn(e, game);
  });

  dom.modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      view.closeModal(modal);
      dom.authForm.username.value = "";
    });
  });

  dom.modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (!e.target.closest(".modal-content")) {
        view.closeModal(modal);
      }
    });
  });

  dom.continueBtn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    view.closeModal(modal);
    dom.authForm.username.value = "";
  });

  dom.cancel.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal");
    view.closeModal(modal);
    game.hero.currentLife = 0;

    game.transition(EVENTS.RESULT_DEAD);
    render(game);
  });
};
