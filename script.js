import { bubbleSort } from "./algorithms/sorting/bubbleSort.js"

const values = [];
const min = 10;
const max = 100;

let sortSteps = [];
let currentStep = 0;

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
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");

const arraySizeSlider = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-value");

function drawArray(array) {
    //delete children
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");

        bar.classList.add("bar");
        bar.style.height = `${array[i] * 3}px`;

        container.appendChild(bar);
    }
}

function resetArray() {
    const size = Number(arraySizeSlider.value);

    generateArray(size);
    
    sortSteps = bubbleSort([...values]);
    currentStep = 0;

    drawArray(sortSteps[currentStep].values);
}

function updateArraySize() {
    arraySizeValue.textContent = arraySizeSlider.value;
}

generateButton.addEventListener("click", resetArray);
arraySizeSlider.addEventListener("input", updateArraySize);

generateArray(Number(arraySizeSlider.value));

//test bubble sort
console.log("Original:", [...values]);

sortSteps = bubbleSort([...values]);
currentStep = 0;

console.log(sortSteps);

//back and next button functionality
currentStep = 0;

function nextStep() {
    if (currentStep < sortSteps.length - 1) {
        currentStep++;
        drawArray(sortSteps[currentStep].values);
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        drawArray(sortSteps[currentStep].values);
    }
}

backButton.addEventListener("click", previousStep);
nextButton.addEventListener("click", nextStep);

drawArray(sortSteps[currentStep].values);

console.log(arraySizeSlider.value);
console.log(values);