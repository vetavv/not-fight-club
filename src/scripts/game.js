import { STATES, EVENTS } from "./gameConstants.js";
import { heroes, enemies } from "./heroes.js";

class Game {
  constructor() {
    this.state = STATES.IDLE;

    this.wins = 0;
    this.fails = 0;

    this.hero = {
      info: heroes.turtle,
      currentAttackZones: [],
      currentDefenseZones: [],
    };

    this.enemy = {
      info: enemies.octopus,
      currentAttackZones: [],
      currentDefenseZones: [],
    };

    this.hero.currentLife = this.hero.info.life;
    this.enemy.currentLife = this.enemy.info.life;

    this.isAuthorized = false;
  }

  transition(event) {
    console.log(this.state, event);
    switch (this.state) {
      case STATES.IDLE:
        if (event === EVENTS.START_CLICKED) {
          // if (this.hero.name) {
          this.state = STATES.READY;
          // } else {
          //   this.state = STATES.AUTHORIZATION;
          // }
        }
        break;
      case STATES.AUTHORIZATION:
        if (event === EVENTS.AUTHORIZATION_CONFIRMED) {
          this.state = STATES.READY;
        }
        break;
      case STATES.READY:
        if (event === EVENTS.FORM_SUBMIT) {
          this.state = STATES.FIGHT;
        } else if (event === EVENTS.RESULT_DEAD || event === EVENTS.STOP_GAME) {
          this.state = STATES.FINISH;
        }
        break;
      case STATES.FIGHT:
        if (event === EVENTS.RESULT_ALIVE) {
          this.state = STATES.READY;
        } else if (event === EVENTS.RESULT_DEAD || event === EVENTS.STOP_GAME) {
          this.state = STATES.FINISH;
        }
        break;
      case STATES.FINISH:
        if (event === EVENTS.EXIT_BATTLE) {
          this.state = STATES.IDLE;
        }
        break;
      default:
        break;
    }
    console.log(this.state);
  }
}

export default Game;
