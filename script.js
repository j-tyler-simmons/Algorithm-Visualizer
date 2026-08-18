import { bubbleSort } from "./algorithms/sorting/bubbleSort.js"

const values = [];
const min = 10;
const max = 100;

let sortSteps = [];
let currentStep = 0;

let playTimeout = null;
let isPlaying = false;
let playbackDelay = 250;

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
const playPauseButton = document.getElementById("play-pause-button");

const arraySizeSlider = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-value");

const stepStatus = document.getElementById("step-status");

const playbackSpeedSlider = document.getElementById("playback-speed");
const playbackSpeedValue = document.getElementById("playback-speed-value");

//updating the step status
function updateStepStatus() {
    const step = sortSteps[currentStep];

    let message = `Step ${currentStep + 1} / ${sortSteps.length}`;

    if (step.type === "compare") {
        message += ` - Comparing indices ${step.indices[0]} and ${step.indices[1]}`;
    }

    if (step.type === "swap") {
        message += ` - Swapped indices ${step.indices[0]} and ${step.indices[1]}`;
    }

    if (step.type === "initial") {
        message += " - Initial array";
    }

    stepStatus.textContent = message;
}

function drawArray(step) {
    //delete children
    container.innerHTML = "";
    for (let i = 0; i < step.values.length; i++) {
        const bar = document.createElement("div");

        bar.classList.add("bar");

        if (step.indices.includes(i)) {
           if (step.type === "compare") {
                bar.classList.add("compare");
           }

           if (step.type === "swap") {
                bar.classList.add("swap");
           }
        }
        
        bar.style.height = `${step.values[i] * 3}px`;

        container.appendChild(bar);
    }
}

function resetArray() {
    pause();

    const size = Number(arraySizeSlider.value);

    generateArray(size);
    
    sortSteps = bubbleSort([...values]);
    currentStep = 0;

    drawArray(sortSteps[currentStep]);
    updateStepStatus();
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

function nextStep() {
    if (currentStep < sortSteps.length - 1) {
        currentStep++;
        drawArray(sortSteps[currentStep]);
        updateStepStatus();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        drawArray(sortSteps[currentStep]);
        updateStepStatus();
    }
}

function pause() {
    isPlaying = false;
    playPauseButton.textContent = "▶";

    if (playTimeout !== null) {
        clearTimeout(playTimeout);
        playTimeout = null;
    }
}

function play() {
    if (isPlaying) {
        return;
    }

    isPlaying = true;
    playPauseButton.textContent = "⏸";
    playNextStep();
}

function playNextStep() {
    if (!isPlaying) {
        return;
    }

    if (currentStep >= sortSteps.length - 1) {
        pause();
        return;
    }

    nextStep();

    playTimeout = setTimeout(playNextStep, playbackDelay);
}

function togglePlayback() {
    if (isPlaying) {
        pause();
        return;
    }

    play();
}

function updatePlaybackSpeed() {
    playbackDelay = Number(playbackSpeedSlider.value);
    playbackSpeedValue.textContent = `${playbackDelay} ms`;
}

backButton.addEventListener("click", previousStep);
nextButton.addEventListener("click", nextStep);
playPauseButton.addEventListener("click", togglePlayback);

playbackSpeedSlider.addEventListener("input", updatePlaybackSpeed);

drawArray(sortSteps[currentStep]);
updateStepStatus();
updateArraySize();
updatePlaybackSpeed();

console.log(arraySizeSlider.value);
console.log(values);