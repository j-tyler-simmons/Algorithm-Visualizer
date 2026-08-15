const values = [];
const min = 10;
const max = 100;

function randomInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min);
}

function generateArray(size) {
    //empty existing array
    values.length = 0;

    for (let i = 0; i < size; i++) {
        values.push(randomInt(min, max));
    }
}

const container = document.getElementById("array-container");
const generateButton = document.getElementById("generate-button");
const arraySizeSlider = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-value");

function drawArray() {
    //delete children
    container.innerHTML = "";
    for (let i = 0; i < values.length; i++) {
        const bar = document.createElement("div");

        bar.classList.add("bar");
        bar.style.height = `${values[i] * 3}px`;

        container.appendChild(bar);
    }
}

function resetArray() {
    const size = Number(arraySizeSlider.value);

    generateArray(size);
    drawArray();
}

function updateArraySize() {
    arraySizeValue.textContent = arraySizeSlider.value;
}

generateButton.addEventListener("click", resetArray);
arraySizeSlider.addEventListener("input", updateArraySize);

generateArray(Number(arraySizeSlider.value));
drawArray();

console.log(arraySizeSlider.value);
console.log(values);