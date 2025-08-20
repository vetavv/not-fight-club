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

export function calcLifes(game) {
  const enemyDamage = calcDamage(
    game.hero.data,
    game.enemy.data,
    game.hero.currentAttackZones,
    game.enemy.currentDefenseZones
  );
  const heroDamage = calcDamage(
    game.enemy.data,
    game.hero.data,
    game.enemy.currentAttackZones,
    game.hero.currentDefenseZones
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

function calcDamage(player1, player2, attackZones, defenseZones) {
  let damage = 0;
  attackZones.forEach((zone) => {
    if (!defenseZones.includes(zone)) {
      damage += Number(player1.damagePower);
      logSuccess(player1, player2, zone);
    } else {
      logFail(player1, zone);
    }
  });
  return damage;
}

function logSuccess(player1, player2, zone) {
  console.log(
    `${player1.name} beat ${zone} and got it`,
    `${player2.name} -${player1.damagePower}`
  );
}

function logFail(player, zone) {
  console.log(`${player.name} beat ${zone} and not got it`);
}
