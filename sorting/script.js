import { bubbleSort } from "./algorithms/sorting/bubbleSort.js"
import { selectionSort } from "./algorithms/sorting/selectionSort.js"
import { insertionSort} from "./algorithms/sorting/insertionSort.js"
import { quickSort } from "./algorithms/sorting/quickSort.js"
import { mergeSort } from "./algorithms/sorting/mergeSort.js"

const values = [];
const min = 10;
const max = 100;

let sortSteps = [];
let currentStep = 0;

let playTimeout = null;
let isPlaying = false;
let playbackDelay = 250;

let mergeTree = null;

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
const mergeTreeContainer = document.getElementById("merge-tree-container");

const generateButton = document.getElementById("generate-button");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const playPauseButton = document.getElementById("play-pause-button");

const arraySizeSlider = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-value");

const stepStatus = document.getElementById("step-status");

const playbackSpeedSlider = document.getElementById("playback-speed");
const playbackSpeedValue = document.getElementById("playback-speed-value");

const algorithmSelect = document.getElementById("algorithm-select");
const algorithmName = document.getElementById("algorithm-name");

//generate based on sorting algorithm
function generateSortSteps() {
    if (algorithmSelect.value === "bubble") {
        sortSteps = bubbleSort([...values]);
    }

    if (algorithmSelect.value === "selection") {
        sortSteps = selectionSort([...values]);
    }

    if (algorithmSelect.value === "insertion") {
        sortSteps = insertionSort([...values]);
    }

    if (algorithmSelect.value === "quick") {
        sortSteps = quickSort([...values]);
    }

    if (algorithmSelect.value === "merge") {
        sortSteps = mergeSort([...values]);

        mergeTree = buildMergeTree(
            values,
            0,
            values.length - 1
        );
    }

    currentStep = 0;
}

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

    if (step.type === "shift") {
        message += ` - Shifted index ${step.indices[0]} to ${step.indices[1]}`;
    }

    if (step.type === "insert") {
        message += ` - Inserted value at index ${step.indices[0]}`;
    }

    if (step.type === "pivot") {
        message += ` - Pivot selected at index ${step.indices[0]}`;
    }

    if (step.type === "write") {
        message += ` - Wrote value at index ${step.indices[0]}`;
    }

    if (step.type === "split") {
        message += ` - Splitting indices ${step.left} through ${step.right}`;
    }

    if (step.type === "merge-complete") {
        message += ` - Merged indices ${step.left} through ${step.right}`;
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

           if (step.type === "shift") {
                bar.classList.add("shift");
           }

           if (step.type === "insert") {
                bar.classList.add("insert");
           }

           if (step.type === "pivot") {
                bar.classList.add("pivot");
           }

           if (step.type === "write") {
                bar.classList.add("write");
           }
        }

        if (step.type === "split" && i === step.mid) {
                bar.classList.add("split-boundary");
        }

        if (step.type === "split" &&
            (i < step.left || i > step.right)) {
            bar.classList.add("inactive");
        }
        
        bar.style.height = `${step.values[i] * 3}px`;

        container.appendChild(bar);
    }
}

function buildMergeTree(values, left, right, depth = 0) {
    const node = {
        left: left,
        right: right,
        depth: depth,
        values: values.slice(left, right + 1),
        leftChild: null,
        rightChild: null
    };

    if (left >= right) {
        return node;
    }

    const mid = Math.floor((left + right) / 2);

    node.leftChild = buildMergeTree(
        values,
        left,
        mid,
        depth + 1
    );

    node.rightChild = buildMergeTree(
        values,
        mid + 1,
        right,
        depth + 1
    );

    return node;
}

function mergeNodeHasAppeared(node) {
    // Root exists from the beginning
    if (
        node.left === 0 &&
        node.right === values.length - 1
    ) {
        return true;
    }

    for (let i = 0; i <= currentStep; i++) {
        const step = sortSteps[i];

        if (step.type !== "split") {
            continue;
        }

        // Was this node created as the left child?
        if (
            node.left === step.left &&
            node.right === step.mid
        ) {
            return true;
        }

        // Was this node created as the right child?
        if (
            node.left === step.mid + 1 &&
            node.right === step.right
        ) {
            return true;
        }
    }

    return false;
}

function getMergeNodeValues(node) {
    let displayedValues = node.values;

    for (let i = 0; i <= currentStep; i++) {
        const step = sortSteps[i];

        if (
            step.type === "merge-complete" &&
            step.left === node.left &&
            step.right === node.right
        ) {
            displayedValues = step.values.slice(
                node.left,
                node.right + 1
            );
        }
    }

    return displayedValues;
}

function addMergeConnector(parent, child) {
    const connector = document.createElement("div");
    connector.classList.add("merge-connector");

    const parentCenter = parent.left + parent.right + 2;
    const childCenter = child.left + child.right + 2;
    const startColumn = Math.min(parentCenter, childCenter);
    const endColumn = Math.max(parentCenter, childCenter);

    connector.style.gridColumn = `${startColumn} / ${endColumn + 1}`;
    connector.style.gridRow = `${parent.depth * 2 + 2}`;

    mergeTreeContainer.appendChild(connector);
}

function addMergeValues(valueBox, node, displayedValues, step) {
    for (let i = 0; i < displayedValues.length; i++) {
        const value = document.createElement("span");

        value.classList.add("merge-value");
        value.textContent = displayedValues[i];

        const globalIndex = node.left + i;

        if (
            step.left === node.left &&
            step.right === node.right
        ) {
            if (
                step.type === "compare" &&
                step.indices.includes(globalIndex)
            ) {
                value.classList.add("merge-compare-value");
            }

            if (
                step.type === "write" &&
                step.indices.includes(globalIndex)
            ) {
                value.classList.add("merge-write-value");   
            }
        }

        valueBox.appendChild(value);
    }
}

function addMergeNodeToGrid(node, step) {
    if (!mergeNodeHasAppeared(node)) {
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("merge-grid-node");

    wrapper.id = `merge-node-${node.left}-${node.right}`;

    wrapper.style.gridColumn = `${node.left * 2 + 1} / ${node.right * 2 + 3}`;

    wrapper.style.gridRow = `${node.depth * 2 + 1}`;

    const valueBox = document.createElement("div");
    valueBox.classList.add("merge-list");

    if (
        step.left === node.left &&
        step.right === node.right
    ) {
        valueBox.classList.add("active-merge-node");
    }

    for (let i = 0; i <= currentStep; i++) {
        const historyStep = sortSteps[i];

        if (
            historyStep.type === "merge-complete" &&
            historyStep.left === node.left &&
            historyStep.right === node.right
        ) {
            valueBox.classList.add("merged-node");
        }
    }

    const displayedValues = getMergeNodeValues(node);

    addMergeValues(
        valueBox,
        node,
        displayedValues,
        step
    );

    wrapper.appendChild(valueBox);

    mergeTreeContainer.appendChild(wrapper);

    if (node.leftChild !== null &&
        mergeNodeHasAppeared(node.leftChild)
    ) {
        addMergeConnector(node, node.leftChild);
    }

    if (node.rightChild !== null &&
        mergeNodeHasAppeared(node.rightChild)
    ) {
        addMergeConnector(node, node.rightChild);
    }

    if (node.leftChild !== null) {
        addMergeNodeToGrid(node.leftChild, step);
    }

    if (node.rightChild !== null) {
        addMergeNodeToGrid(node.rightChild, step);
    }
}

function drawConnection(
    svg,
    containerRect,
    parentElement,
    childNode
) {
    const childElement =
        document.getElementById(
            `merge-node-${childNode.left}-${childNode.right}`
        );

    if (childElement === null) {
        return;
    }

    const parentRect = parentElement.getBoundingClientRect();
    const childRect = childElement.getBoundingClientRect();

    const x1 =
        parentRect.left +
        parentRect.width / 2 -
        containerRect.left;

    const y1 =
        parentRect.bottom -
        containerRect.top;

    const x2 =
        childRect.left +
        childRect.width / 2 -
        containerRect.left;
    
    const y2 =
        childRect.top -
        containerRect.top;
    
    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    line.classList.add("merge-tree-line");

    svg.appendChild(line);
}

function drawMergeConnectors(svg) {
    const containerRect = mergeTreeContainer.getBoundingClientRect();

    function connectNode(node) {
        if (!mergeNodeHasAppeared(node)) {
            return;
        }

        const parentElement = document.getElementById(
            `merge-node-${node.left}-${node.right}`
        );

        if (parentElement === null) {
            return;
        }

        if (
            node.leftChild !== null &&
            mergeNodeHasAppeared(node.leftChild)
        ) {
            drawConnection(
                svg,
                containerRect,
                parentElement,
                node.leftChild
            );

            connectNode(node.leftChild);
        }

        if (
            node.rightChild !== null &&
            mergeNodeHasAppeared(node.rightChild)
        ) {
            drawConnection(
                svg,
                containerRect,
                parentElement,
                node.rightChild
            );

            connectNode(node.rightChild);
        }
    }

    connectNode(mergeTree);
}

function drawMergeTree(step) {
    mergeTreeContainer.innerHTML = "";

    mergeTreeContainer.style.setProperty(
        "--merge-columns",
        values.length * 2
    );

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.classList.add("merge-tree-lines");

    mergeTreeContainer.appendChild(svg);

    addMergeNodeToGrid(mergeTree, step);

    drawMergeConnectors(svg);
}

function drawCurrentStep() {
    const step = sortSteps[currentStep];

    if (algorithmSelect.value === "merge") {
        container.style.display = "none";
        mergeTreeContainer.style.display = "grid";

        drawMergeTree(step);
    }
    else {
        container.style.display = "flex";
        mergeTreeContainer.style.display = "none";

        drawArray(step);
    }
}

function resetArray() {
    pause();

    const size = Number(arraySizeSlider.value);

    generateArray(size);
    
    generateSortSteps();

    drawCurrentStep();
    updateStepStatus();
}

function updateArraySizeLimit() {
    if (algorithmSelect.value === "merge") {
        arraySizeSlider.max = 16;

        if (Number(arraySizeSlider.value) > 16) {
            arraySizeSlider.value = 16;
        }
    }
    else {
        arraySizeSlider.max = 100;
    }

    updateArraySize();
}

function updateArraySize() {
    arraySizeValue.textContent = arraySizeSlider.value;
}

generateButton.addEventListener("click", resetArray);
arraySizeSlider.addEventListener("input", updateArraySize);

generateArray(Number(arraySizeSlider.value));

//test bubble sort
console.log("Original:", [...values]);

generateSortSteps();

console.log(sortSteps);

function nextStep() {
    if (currentStep < sortSteps.length - 1) {
        currentStep++;
        drawCurrentStep();
        updateStepStatus();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        drawCurrentStep();
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

function updateAlgorithmName() {
    algorithmName.textContent =
        algorithmSelect.options[algorithmSelect.selectedIndex].text;
}

function changeAlgorithm() {
    pause();

    updateArraySizeLimit();

    const size = Number(arraySizeSlider.value);
    generateArray(size);

    generateSortSteps();
    updateAlgorithmName();

    drawCurrentStep();
    updateStepStatus();   
}

backButton.addEventListener("click", previousStep);
nextButton.addEventListener("click", nextStep);
playPauseButton.addEventListener("click", togglePlayback);

playbackSpeedSlider.addEventListener("input", updatePlaybackSpeed);

algorithmSelect.addEventListener("change", changeAlgorithm);

updateArraySizeLimit();
drawCurrentStep();
updateStepStatus();
updateArraySize();
updatePlaybackSpeed();
updateAlgorithmName();

console.log(arraySizeSlider.value);
console.log(values);