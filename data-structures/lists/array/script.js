const values = [17, 42, 8, 91, 33];

const arrayContainer = document.getElementById("array-container");

const operationSelect = document.getElementById("operation-select");
const indexInput = document.getElementById("index-input");
const runOperationButton = document.getElementById("run-operation");
const operationStatus = document.getElementById("operation-status");

runOperationButton.addEventListener("click", runOperation);

let highlightedIndex = null;

function drawArray() {
    arrayContainer.innerHTML = "";

    for (let i = 0; i < values.length; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("array-item");

        const index = document.createElement("div");
        index.classList.add("array-index");
        index.textContent = i;

        const value = document.createElement("div");
        value.classList.add("array-value");

        if (i === highlightedIndex) {
            value.classList.add("array-access");
        }

        value.textContent = values[i];

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
}

function accessArray() {
    const index = Number(indexInput.value);

    if (
        index < 0 ||
        index >= values.length
    ) {
        return;
    }

    highlightedIndex = index;
    drawArray();
    operationStatus.textContent = `Accessed index ${index}: value = ${values[index]}`;
}

//render
drawArray();