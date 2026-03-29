import "./../styles/fonts.css";
import "./../styles/vars.css";
import "./../styles/general.css";
import "./../assets/favicon.ico";

import Game from "./game.js";
import { initGameUI, render } from "./gameControllers.js";
import listenEvents from "./listeners.js";

function initApp() {
  const game = new Game();
  initGameUI(game);
  render(game);
  listenEvents(game);
}

initApp();
