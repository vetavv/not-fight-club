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

// battle block
export const heroImgBattle = document.querySelector("#battleHeroImg");
export const heroLifeBattle = document.querySelector("#battleHeroLife");
export const heroLifeBar = document.querySelector("#heroLifeBar");
export const heroLifeValue = document.querySelector("#battleHeroCurrentLife");

export const enemyImgBattle = document.querySelector("#battleEnemyImg");
export const enemyLifeBattle = document.querySelector("#battleEnemyLife");
export const enemyLifeBar = document.querySelector("#enemyLifeBar");
export const enemyLifeValue = document.querySelector("#battleEnemyCurrentLife");

export const form = document.querySelector("#form");
export const formBtn = document.querySelector("#formSubmit");
export const defenseZones = document.querySelector("#defenseZones");
export const attackZones = document.querySelector("#attackZones");

// profile block
export const heroImgProfile = document.querySelector("#profileImg");
export const heroName = document.querySelector("#profileHero");
export const profileLife = document.querySelector("#profileLife");
export const profileAttackCount = document.querySelector("#profileAttackCount");
export const profileDefenseCount = document.querySelector(
  "#profileDefenseCount"
);
export const changeBtn = document.querySelector("#chooseHeroProfile");
