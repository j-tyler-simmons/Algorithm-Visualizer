const values = [17, 42, 8, 91, 33];

const arrayContainer = document.getElementById("array-container");

const operationSelect = document.getElementById("operation-select");
const operationInput = document.getElementById("operation-input");
const runOperationButton = document.getElementById("run-operation");
const operationStatus = document.getElementById("operation-status");

runOperationButton.addEventListener("click", runOperation);
operationSelect.addEventListener(
    "change",
    updateOperationControls
);

let highlightedIndex = null;
//search variables
let searchSteps = [];
let currentSearchStep = 0;
let searchDelay = 500;

function drawArray(step = null) {
    arrayContainer.innerHTML = "";

    for (let i = 0; i < values.length; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("array-item");

        const index = document.createElement("div");
        index.classList.add("array-index");
        index.textContent = i;

        const value = document.createElement("div");
        value.classList.add("array-value");
        value.textContent = values[i];

        //highlight accessed index
        if (i === highlightedIndex) {
            value.classList.add("array-access");
        }

        //highlight the current search step
        if (step !== null && step.index === i) {
            if (step.type === "compare") {
                value.classList.add("array-search");
            }
            else if (step.type === "found") {
                value.classList.add("array-found");
            }
        }

        wrapper.appendChild(index);
        wrapper.appendChild(value);

        arrayContainer.appendChild(wrapper);
    }
}

function runOperation() {
    const operation = operationSelect.value;

    if (operation === "access") {
        accessArray();
    }
    else if (operation === "search") {
        searchArray();
    }
}

function accessArray() {
    const index = Number(operationInput.value);

    if (
        index < 0 ||
        index >= values.length
    ) {
        operationStatus.textContent =
            `Invalid index. Enter an index from 0 to ${values.length - 1}.`;

        return;
    }

    highlightedIndex = index;
    drawArray();
    operationStatus.textContent = `Accessed index ${index}: value = ${values[index]}`;
}

function searchArray() {
    const target = Number(operationInput.value);

    searchSteps = [];

    let found = false;

    for (let i = 0; i < values.length; i++) {
        searchSteps.push({
            type: "compare",
            index: i
        });

        if (values[i] === target) {
            searchSteps.push({
                type: "found",
                index: i
            });

            found = true;
            break;
        }
    }

    if (!found) {
        searchSteps.push({
            type: "not-found"
        });
    }

    currentSearchStep = 0;
    playSearchStep();
}

function playSearchStep() {
    if (currentSearchStep >= searchSteps.length) {
        return;
    }

    const step = searchSteps[currentSearchStep];

    drawArray(step);

    if (step.type === "compare") {
        operationStatus.textContent =
            `Checking index ${step.index}: value = ${values[step.index]}`;
    }
    else if (step.type === "found") {
        operationStatus.textContent =
            `Found ${values[step.index]} at index ${step.index}`;
    }
    else if (step.type === "not-found") {
        operationStatus.textContent =
            `${operationInput.value} was not found in the array.`;

        drawArray();
    }

    currentSearchStep++;

    if (currentSearchStep < searchSteps.length) {
        setTimeout(playSearchStep, searchDelay);
    }
}

function updateOperationControls() {
    const operation = operationSelect.value;

    //clear visualization state from previous operation
    highlightedIndex = null;
    searchSteps = [];
    currentSearchStep = 0;

    operationStatus.textContent = "Select an operation to begin.";

    drawArray();

    if (operation === "access") {
        operationInput.placeholder = "Index";
    }
    else if (operation === "search") {
        operationInput.placeholder = "Value";
    }
}

//render
drawArray();