import { createUniqueRandomGenerator } from "./utils.js";

import { updateLifeBar } from "./gameView.js";
import {
  enemyLifeValue,
  heroLifeValue,
  attackZones,
  defenseZones,
} from "./domElements.js";

export function isFormValid(form, hero) {
  const attackCount = hero.attackZonesCount;
  const defenseCount = hero.defenseZonesCount;

  let checkedAttacks = calcCheckedInputs(attackZones, attackCount);
  let checkedDefenses = calcCheckedInputs(defenseZones, defenseCount);

  return checkedAttacks === attackCount && checkedDefenses === defenseCount;
}

function calcCheckedInputs(group, count) {
  let checkedCount = 0;
  if (count === 1) {
    checkedCount = group.querySelector("input[type=radio]:checked") ? 1 : 0;
  } else {
    checkedCount = group.querySelectorAll(
      "input[type=checkbox]:checked"
    ).length;
  }
  return checkedCount;
}

export function generateEnemyMove(game) {
  const enemyZones = game.enemy.data.zones;
  const heroZones = game.hero.data.zones;

  const getRandomAttack = createUniqueRandomGenerator(enemyZones.length);
  for (let i = 0; i < game.enemy.data.defenseZonesCount; i++) {
    game.enemy.currentDefenseZones.push(enemyZones[getRandomAttack()]);
  }

  const getRandomDefense = createUniqueRandomGenerator(heroZones.length);
  for (let i = 0; i < game.enemy.data.attackZonesCount; i++) {
    game.enemy.currentAttackZones.push(heroZones[getRandomDefense()]);
  }
}

export function resetEnemyMove(game) {
  game.enemy.currentAttackZones = [];
  game.enemy.currentDefenseZones = [];
}

import { heroLog, enemyLog } from "./domElements.js";

export function calcLifes(game) {
  const enemyDamage = calcDamage(
    game.hero,
    game.enemy,
    game.hero.currentAttackZones,
    game.enemy.currentDefenseZones,
    enemyLog
  );
  const heroDamage = calcDamage(
    game.enemy,
    game.hero,
    game.enemy.currentAttackZones,
    game.hero.currentDefenseZones,
    heroLog
  );

  game.enemy.currentLife -= enemyDamage;
  game.hero.currentLife -= heroDamage;

  if (game.enemy.currentLife < 0) game.enemy.currentLife = 0;
  if (game.hero.currentLife < 0) game.hero.currentLife = 0;

  updateLifeBar(enemyLifeBar, game.enemy.currentLife, game.enemy.data.life);
  updateLifeBar(heroLifeBar, game.hero.currentLife, game.hero.data.life);

  enemyLifeValue.textContent = game.enemy.currentLife;
  heroLifeValue.textContent = game.hero.currentLife;
}

function calcDamage(player1, player2, attackZones, defenseZones, block) {
  let damage = 0;

  const ul = document.createElement("ul");
  ul.classList.add("log__block");

  attackZones.forEach((zone) => {
    if (!defenseZones.includes(zone)) {
      damage += Number(player1.data.damagePower);
      logSuccess(player1, player2, zone, ul);
    } else {
      logFail(player1, player2, zone, ul);
    }
  });
  block.prepend(ul);
  return damage;
}

function logSuccess(player1, player2, zone, block) {
  // console.log(
  //   `${player1.name} beat ${zone} and got it`,
  //   `${player2.name} -${player1.damagePower}`
  // );

  const li = document.createElement("li");
  li.classList.add("log__item");
  const name1 = document.createElement("span");
  name1.textContent = player1.name ?? player1.data.name;
  name1.classList.add("log__accent");
  const name2 = document.createElement("span");
  name2.textContent = player2.name ?? player2.data.name;
  name2.classList.add("log__accent");
  const zoneEl = document.createElement("span");
  zoneEl.textContent = zone;
  zoneEl.classList.add("log__accent");
  const damage = document.createElement("span");
  damage.textContent = `–${player1.data.damagePower}`;
  damage.classList.add("log__bold");
  li.append(
    name1,
    ` strikes `,
    name2,
    `’s `,
    zoneEl,
    `: `,
    name2.cloneNode(true),
    ` `,
    damage
  );
  block.append(li);
  // heroLog.textContent = `${player1.name} attack ${zone} and got it
  // ${player2.name} -${player1.damagePower}`;
}

function logFail(player1, player2, zone, block) {
  // console.log(`${player.name} beat ${zone} and not got it`);

  const li = document.createElement("li");
  li.classList.add("log__item");
  const name1 = document.createElement("span");
  name1.textContent = player1.name ?? player1.data.name;
  name1.classList.add("log__accent");
  const name2 = document.createElement("span");
  name2.textContent = player2.name ?? player2.data.name;
  name2.classList.add("log__accent");
  const zoneEl = document.createElement("span");
  zoneEl.textContent = zone;
  zoneEl.classList.add("log__accent");
  li.append(name1, ` tried to hit `, name2, `’s `, zoneEl, ` but failed.`);
  block.append(li);
}
