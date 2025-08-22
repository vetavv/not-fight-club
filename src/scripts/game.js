import { STATES, EVENTS } from "./gameConstants.js";
import { heroes, enemies } from "./heroes.js";

class Game {
  constructor() {
    this.state = STATES.IDLE;

    this.wins = 0;
    this.fails = 0;

    this.hero = {
      data: heroes.turtle,
      currentLife: 0,
      currentAttackZones: [],
      currentDefenseZones: [],
    };

    this.enemy = {
      data: enemies.octopus,
      currentLife: 0,
      currentAttackZones: [],
      currentDefenseZones: [],
    };

    this.hero.currentLife = this.hero.data.life;
    this.enemy.currentLife = this.hero.data.life;
  }

  transition(event) {
    switch (this.state) {
      case STATES.IDLE:
        if (event === EVENTS.START_CLICKED) {
          this.state = STATES.READY;
        }
        break;
      case STATES.READY:
        if (event === EVENTS.FORM_SUBMIT) {
          this.state = STATES.FIGHT;
        } else if (event === EVENTS.RESULT_DEAD) {
          this.state = STATES.FINISH;
        }
        break;
      case STATES.FIGHT:
        if (event === EVENTS.RESULT_ALIVE) {
          this.state = STATES.READY;
        } else if (event === EVENTS.RESULT_DEAD) {
          this.state = STATES.FINISH;
        }
        break;
      case STATES.FINISH:
        this.state = STATES.IDLE;
        break;
      default:
        break;
    }
  }
}

export default Game;
