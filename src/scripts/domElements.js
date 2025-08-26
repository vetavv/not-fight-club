export const page = document.querySelector(".page");
export const auth = document.querySelector("#auth");
export const authForm = document.querySelector("#auth-form");
export const authErr = document.querySelector("#authErr");
export const winModal = document.querySelector("#win");
export const winModalBtn = winModal.querySelector(".btn");
export const loseModal = document.querySelector("#lose");
export const loseModalBtn = loseModal.querySelector(".btn");
export const modalCloseBtns = document.querySelectorAll(".modal .modal__close");
export const modals = document.querySelectorAll(".modal");
export const warning = document.querySelector("#warning");
export const cancel = document.querySelector("#cancelBtn");
export const continueBtn = document.querySelector("#continueBtn");

export const startBlock = document.querySelector("#home");
export const figthBlock = document.querySelector("#battle");
export const profileBlock = document.querySelector("#profile");
export const chooseHeroBlock = document.querySelector("#chooseHero");
export const chooseEnemyBlock = document.querySelector("#chooseEnemy");
export const blocks = [
  startBlock,
  figthBlock,
  profileBlock,
  chooseHeroBlock,
  chooseEnemyBlock,
];

export const navProfile = document.querySelector("#profileNav");
export const navHome = document.querySelector("#homeNav");
export const navSettings = document.querySelector("#settingsNav");
export const navBtns = [navProfile, navHome, navSettings];

export const startBtn = document.querySelector("#start");

// chose block
export const heroesList = document.querySelector("#heroesList");
export const enemiesList = document.querySelector("#enemiesList");
export const chooseEnemyBtn = document.querySelector("#chooseEnemyBtn");

// battle block
export const heroImgBattle = document.querySelector("#battleHeroImg");
export const heroLifeBattle = document.querySelector("#battleHeroLife");
export const heroLifeBar = document.querySelector("#heroLifeBar");
export const heroCurrentValue = document.querySelector(
  "#battleHeroCurrentLife"
);

export const enemyImgBattle = document.querySelector("#battleEnemyImg");
export const enemyLifeBattle = document.querySelector("#battleEnemyLife");
export const enemyLifeBar = document.querySelector("#enemyLifeBar");
export const enemyCurrentValue = document.querySelector(
  "#battleEnemyCurrentLife"
);

export const form = document.querySelector("#form");
export const formBtn = document.querySelector("#formSubmit");
export const defenseZones = document.querySelector("#defenseZones");
export const attackZones = document.querySelector("#attackZones");

export const heroNameBattle = document.querySelector("#heroNameBattle");
export const enemyNameBattle = document.querySelector("#enemyNameBattle");

export const heroLog = document.querySelector("#heroLog");
export const enemyLog = document.querySelector("#enemyLog");
export const defenseInfo = document.querySelector("#defenseInfo");
export const attackInfo = document.querySelector("#attackInfo");

// profile block
export const heroImgProfile = document.querySelector("#profileImg");
export const profileName = document.querySelector("#profileName");
export const heroName = document.querySelector("#profileHero");
export const profileLife = document.querySelector("#profileLife");
export const profileAttackCount = document.querySelector("#profileAttackCount");
export const profileDefenseCount = document.querySelector(
  "#profileDefenseCount"
);
export const changeBtn = document.querySelector("#chooseHeroProfile");
export const changeNameBtn = document.querySelector("#changeName");

export const names = document.querySelectorAll('[data-bind="name"]');

export const heroNames = document.querySelectorAll('[data-bind="heroName"]');
export const heroLifes = document.querySelectorAll('[data-bind="heroLife"]');
export const heroAttackPowers = document.querySelectorAll(
  '[data-bind="heroAttackPower"]'
);
export const heroDefensePowers = document.querySelectorAll(
  '[data-bind="heroDefensePower"]'
);
export const heroDamagePowers = document.querySelectorAll(
  '[data-bind="heroDamagePowers"]'
);

export const heroImages = document.querySelectorAll('[data-bind="heroImage"]');

export const enemyNames = document.querySelectorAll('[data-bind="enemyName"]');
export const enemyLifes = document.querySelectorAll('[data-bind="enemyLife"]');
export const enemyAttackPowers = document.querySelectorAll(
  '[data-bind="enemyAttackPower"]'
);
export const enemyDefensePowers = document.querySelectorAll(
  '[data-bind="enemyDefensePower"]'
);
export const enemyDamagePowers = document.querySelectorAll(
  '[data-bind="enemyDamagePowers"]'
);
export const enemyImages = document.querySelectorAll(
  '[data-bind="enemyImage"]'
);

export const statWins = document.querySelector("#statWins");
export const statFails = document.querySelector("#statFails");
