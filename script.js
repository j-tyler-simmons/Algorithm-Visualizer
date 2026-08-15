const values = [];
const min = 10;
const max = 100;

function randomInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

for (let i = 0; i < 20; i++) {
    values.push(randomInt(min, max));
}

console.log(values);