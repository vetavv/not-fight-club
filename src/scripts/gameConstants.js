import {
  startBlock,
  figthBlock,
  profileBlock,
  chooseHeroBlock,
  chooseEnemyBlock,
} from "./domElements.js";
export const STATES = {
  IDLE: "idle",
  AUTHORIZATION: "authorization",
  READY: "ready",
  FIGHT: "fight",
  FINISH: "finish",
};

export const EVENTS = {
  START_CLICKED: "start_clicked",
  AUTHORIZATION_CONFIRMED: "authorization_confirmed",
  FORM_SUBMIT: "form_submit",
  EXIT_BATTLE: "exit_battle",
  RESULT_ALIVE: "result_alive",
  RESULT_DEAD: "result_dead",
  RESULT_CONFIRMED: "result_confirmed",
};

export const NAV_MAP = {
  home: [startBlock],
  battle: [figthBlock],
  profile: [profileBlock],
  profileChange: [profileBlock, chooseHeroBlock],
  settings: [chooseHeroBlock, chooseEnemyBlock],
};
