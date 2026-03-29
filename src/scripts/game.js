import { STATES, EVENTS } from "./gameConstants.js";
import { heroes, enemies } from "./heroes.js";

class Game {
  constructor() {
    this.state = localStorage.getItem("state") ?? STATES.IDLE;

    this.wins = Number(localStorage.getItem("wins")) || 0;
    this.fails = Number(localStorage.getItem("fails")) || 0;

    this.hero = JSON.parse(localStorage.getItem("hero")) ?? {
      info: heroes.turtle,
      currentAttackZones: [],
      currentDefenseZones: [],
    };

    this.enemy = JSON.parse(localStorage.getItem("enemy")) ?? {
      info: enemies.octopus,
      currentAttackZones: [],
      currentDefenseZones: [],
    };

    this.hero.currentLife =
      JSON.parse(localStorage.getItem("hero"))?.currentLife ??
      this.hero.info.life;
    this.enemy.currentLife =
      JSON.parse(localStorage.getItem("enemy"))?.currentLife ??
      this.enemy.info.life;

    this.isAuthorized = localStorage.getItem("isAuthorized") ?? false;
    this.hero.name = JSON.parse(localStorage.getItem("hero"))?.name ?? null;

    this.logsHero = JSON.parse(localStorage.getItem("logsHero")) ?? [];
    this.logsEnemy = JSON.parse(localStorage.getItem("logsEnemy")) ?? [];
  }

  updateLocalStorage() {
    localStorage.setItem("state", this.state);
    localStorage.setItem("wins", String(this.wins));
    localStorage.setItem("fails", String(this.fails));
    localStorage.setItem("hero", JSON.stringify(this.hero));
    localStorage.setItem("enemy", JSON.stringify(this.enemy));
    localStorage.setItem("isAuthorized", String(this.isAuthorized));
    localStorage.setItem("logsHero", JSON.stringify(this.logsHero));
    localStorage.setItem("logsEnemy", JSON.stringify(this.logsEnemy));
  }

  transition(event) {
    switch (this.state) {
      case STATES.IDLE:
        if (event === EVENTS.START_CLICKED) {
          this.state = STATES.READY;
          this.logsEnemy = [];
          this.logsHero = [];
          this.updateLocalStorage();
        }
        break;
      case STATES.READY:
        if (event === EVENTS.FORM_SUBMIT) {
          this.state = STATES.FIGHT;
          this.updateLocalStorage();
        } else if (event === EVENTS.RESULT_DEAD || event === EVENTS.STOP_GAME) {
          this.state = STATES.FINISH;
          this.updateLocalStorage();
        }
        break;
      case STATES.FIGHT:
        if (event === EVENTS.RESULT_ALIVE) {
          this.state = STATES.READY;
          this.updateLocalStorage();
        } else if (event === EVENTS.RESULT_DEAD || event === EVENTS.STOP_GAME) {
          this.state = STATES.FINISH;
          this.updateLocalStorage();
        }
        break;
      case STATES.FINISH:
        if (event === EVENTS.EXIT_BATTLE) {
          this.state = STATES.IDLE;
          this.updateLocalStorage();
        }
        break;
      default:
        break;
    }
  }
}

export default Game;
