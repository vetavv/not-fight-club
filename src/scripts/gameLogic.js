import { createUniqueRandomGenerator } from "./utils.js";
import { heroLog, enemyLog } from "./domElements.js";

export function isFormValid(
  attackCount,
  defenseCount,
  attackZones,
  defenseZones
) {
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
  const enemyZones = game.enemy.info.zones;
  const heroZones = game.hero.info.zones;

  const getRandomAttack = createUniqueRandomGenerator(enemyZones.length);
  for (let i = 0; i < game.enemy.info.defenseZonesCount; i++) {
    game.enemy.currentDefenseZones.push(enemyZones[getRandomAttack()]);
  }

  const getRandomDefense = createUniqueRandomGenerator(heroZones.length);
  for (let i = 0; i < game.enemy.info.attackZonesCount; i++) {
    game.enemy.currentAttackZones.push(heroZones[getRandomDefense()]);
  }
}

export function resetEnemyMove(game) {
  game.enemy.currentAttackZones = [];
  game.enemy.currentDefenseZones = [];
  game.updateLocalStorage();
}

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

  game.updateLocalStorage();
}

function calcDamage(player1, player2, attackZones, defenseZones, block) {
  let damage = 0;

  const ul = document.createElement("ul");
  ul.classList.add("log__block");

  attackZones.forEach((zone) => {
    if (!defenseZones.includes(zone)) {
      damage += Number(player1.info.damagePower);
      logSuccess(player1, player2, zone, ul);
    } else {
      logFail(player1, player2, zone, ul);
    }
  });
  block.prepend(ul);
  return damage;
}

function logSuccess(player1, player2, zone, block) {
  const li = document.createElement("li");
  li.classList.add("log__item");
  const name1 = document.createElement("span");
  name1.textContent = player1.name ?? player1.info.name;
  name1.classList.add("log__accent");
  const name2 = document.createElement("span");
  name2.textContent = player2.name ?? player2.info.name;
  name2.classList.add("log__accent");
  const zoneEl = document.createElement("span");
  zoneEl.textContent = zone;
  zoneEl.classList.add("log__accent");
  const damage = document.createElement("span");
  damage.textContent = `–${player1.info.damagePower}`;
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
}

function logFail(player1, player2, zone, block) {
  const li = document.createElement("li");
  li.classList.add("log__item");
  const name1 = document.createElement("span");
  name1.textContent = player1.name ?? player1.info.name;
  name1.classList.add("log__accent");
  const name2 = document.createElement("span");
  name2.textContent = player2.name ?? player2.info.name;
  name2.classList.add("log__accent");
  const zoneEl = document.createElement("span");
  zoneEl.textContent = zone;
  zoneEl.classList.add("log__accent");
  li.append(name1, ` tried to hit `, name2, `’s `, zoneEl, ` but failed.`);
  block.append(li);
}
