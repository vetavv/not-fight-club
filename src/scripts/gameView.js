import {
  navBtns,
  blocks,
  heroImgProfile,
  heroName,
  profileLife,
  profileAttackCount,
  profileDefenseCount,
  defenseZones,
  attackZones,
  page,
  heroLifeValue,
} from "./domElements.js";

export function activateNavBtn(btn) {
  btn.classList.add("current");
  btn.setAttribute("disabled", "disabled");
}

export function deactivateNavBtn(btn) {
  btn.classList.remove("current");
  btn.removeAttribute("disabled");
}

export function resetNavBtns() {
  navBtns.forEach((btn) => {
    deactivateNavBtn(btn);
  });
}

export function switchOverBlocks(...currentBlocks) {
  resetNavBtns();
  hideBlocks(blocks);
  showBlocks(currentBlocks);
}

function hideBlocks(blocks) {
  blocks.forEach((block) => {
    block.classList.add("hidden");
  });
}

function showBlocks(blocks) {
  blocks.forEach((block) => {
    block.classList.remove("hidden");
  });
}

export function createCard(character) {
  const li = createElement("li", "card");
  li.setAttribute("id", character.id);
  const divImgContainer = createElement(
    "div",
    "character",
    "card__img-container"
  );
  const divImg = createElement("div", "character__img", "card__img", "idle");
  divImg.style.backgroundImage = `url('./../assets/images/heroes/${character.dirname}/Idle.png')`;

  divImgContainer.append(divImg);
  li.append(divImgContainer);

  const cardInfo = createElement("div", "card__info");
  const name = createElement("p", "card__name");
  name.textContent = character.name;
  const list = createElement("dl", "list");
  cardInfo.append(name);
  cardInfo.append(list);

  const fields = [
    ["Life", character.life],
    ["Attack power", character.attackZonesCount],
    ["Defense power", character.defenseZonesCount],
    ["Damage power", character.damagePower],
    ["Critical strike", character.critical],
  ];

  fields.forEach(([key, value]) => {
    const item = createElement("div", "list__item");
    const dt = createElement("dt", "list__key");
    dt.textContent = key;
    const dd = createElement("dd", "list__value");
    dd.textContent = value;
    item.append(dt, dd);
    list.appendChild(item);
  });

  li.append(cardInfo);
  return li;
}

export function fillList(list, characters) {
  for (let character in characters) {
    const newItem = createCard(characters[character]);
    list.append(newItem);
  }
}

function createElement(name, ...classes) {
  const el = document.createElement(name);
  el.classList.add(...classes);
  return el;
}

export function updateLifeBar(bar, value, life) {
  const percent = (value * 100) / life;
  bar.style.right = `${100 - percent}%`;
}

export function updateBattleBlock(img, life, character) {
  updateCharacterImg(img, character.dirname);
  life.textContent = character.life;
}

export function updateCharacterImg(img, newDir, characterState) {
  img.style.backgroundImage = `url('./../assets/images/heroes/${newDir}/${
    characterState ?? "Idle"
  }.png')`;
}

export function updateProfile(hero) {
  updateCharacterImg(heroImgProfile, hero.dirname);
  heroName.textContent = hero.name;
  profileLife.textContent = hero.life;
  profileAttackCount.textContent = hero.attackZonesCount;
  profileDefenseCount.textContent = hero.defenseZonesCount;
}

export function setActiveCharacter(list, id) {
  const cards = list.querySelectorAll(".card");
  cards.forEach((card) => {
    if (card.id === id) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

export function fillForm(form, hero, enemy) {
  const attackType = hero.attackZonesCount === 1 ? "radio" : "checkbox";
  const defenseType = hero.defenseZonesCount === 1 ? "radio" : "checkbox";

  attackZones.textContent = "";
  defenseZones.textContent = "";

  enemy.zones.forEach((zone) => {
    const input = createInput(zone, "attack", attackType);
    attackZones.append(input);
  });

  hero.zones.forEach((zone) => {
    const input = createInput(zone, "defense", defenseType);
    defenseZones.append(input);
  });
}

function createInput(value, name, type) {
  const label = createElement("label", "form__input");
  const input = createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("value", value);
  input.setAttribute("name", name);
  const control = createElement("span", "form__control");
  const spanName = createElement("span", "form__label");
  spanName.textContent = value;
  label.append(input);
  label.append(control);
  label.append(spanName);
  return label;
}

export function openModal(modal) {
  modal.classList.add("open");
  page.classList.add("modal-open");
}

export function closeModal(modal) {
  modal.classList.remove("open");
  page.classList.remove("modal-open");
}
