import { faker } from "@faker-js/faker";

let uid = 0;

function generateItem() {
  return {
    name: faker.name.findName(),
    avatar: faker.internet.avatar()
  };
}

export function getData(count, letters) {
  const raw = {};

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  for (const l of alphabet) {
    raw[l] = [];
  }

  for (let i = 0; i < count; i++) {
    const item = generateItem();
    const letter = item.name.charAt(0).toLowerCase();
    raw[letter].push(item);
  }

  const list = [];
  let index = 1;

  for (const l of alphabet) {
    raw[l] = raw[l].sort((a, b) => (a.name < b.name ? -1 : 1));
    if (letters) {
      list.push({
        id: uid++,
        index: index++,
        type: "letter",
        value: l,
        height: 200
      });
    }
    for (const item of raw[l]) {
      list.push({
        id: uid++,
        index: index++,
        type: "person",
        value: item,
        height: 50
      });
    }
  }

  return list;
}

export function addItem(list) {
  list.push({
    id: uid++,
    index: list.length + 1,
    type: "person",
    value: generateItem(),
    height: 50
  });
}

export function generateMessage() {
  return {
    avatar: faker.internet.avatar(),
    message: faker.lorem.text()
  };
}
