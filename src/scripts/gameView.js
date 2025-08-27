import * as dom from "./domElements.js";

export function activateNavBtn(btn) {
  resetNavBtns();
  btn.classList.add("current");
  btn.setAttribute("disabled", "disabled");
}

export function deactivateNavBtn(btn) {
  btn.classList.remove("current");
  btn.removeAttribute("disabled");
}

export function resetNavBtns() {
  dom.navBtns.forEach((btn) => {
    deactivateNavBtn(btn);
  });
}

export function switchOverBlocks(currentBlocks) {
  hideBlocks(dom.blocks);
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
  divImg.style.backgroundImage = `url('./assets/images/heroes/${character.dirname}/Idle.png')`;

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

export function updateLifeBar(domBar, domValue, value, life) {
  const percent = (value * 100) / life;
  domBar.style.right = `${100 - percent}%`;
  domValue.textContent = value;
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

export function fillForm(hero, enemy) {
  const attackType = hero.info.attackZonesCount === 1 ? "radio" : "checkbox";
  const defenseType = hero.info.defenseZonesCount === 1 ? "radio" : "checkbox";

  dom.attackZones.textContent = "";
  dom.defenseZones.textContent = "";

  enemy.zones.forEach((zone) => {
    const input = createInput(
      zone,
      "attack",
      attackType,
      hero.currentAttackZones.includes(zone)
    );
    dom.attackZones.append(input);
  });

  hero.info.zones.forEach((zone) => {
    const input = createInput(
      zone,
      "defense",
      defenseType,
      hero.currentDefenseZones.includes(zone) || ""
    );
    dom.defenseZones.append(input);
  });
}

function createInput(value, name, type, checked) {
  const label = createElement("label", "form__input");
  const input = createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("value", value);
  input.setAttribute("name", name);
  if (checked) input.setAttribute("checked", checked);
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
  dom.page.classList.add("modal-open");
}

export function closeModal(modal) {
  modal.classList.remove("open");
  dom.page.classList.remove("modal-open");
}
