class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null
    }

    insert(value) {
        const newNode = new Node(value);

        if(this.head === null) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }

        this.tail.next = newNode;
        this.tail = newNode;
    }

    search(value, onVisit = null) {
        let node = this.head

        while (node !== null) {
            if (onVisit !== null) {
                onVisit(node);
            }

            if (node.value === value) {
                return node;
            }

            node = node.next;
        }

        return null;
    }

    insertInOrder(value) {
        const newNode = new Node(value);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
            return newNode;
        }

        if (newNode.value <= this.head.value) {
            newNode.next = this.head;
            this.head = newNode;
            return newNode;
        }

        let prev = this.head;
        let current = this.head.next;

        while (current !== null && current.value < value) {
            prev = current;
            current = current.next;
        }

        newNode.next = current;
        prev.next = newNode;

        if (current == null) {
            this.tail = newNode;
        }

        return newNode;
    }

    reverse(current = this.head, isInitialCall = true) {
        if (current === null) {
            return null;
        }

        if (current.next === null) {
            return current;
        }

        const newHead = this.reverse(current.next, false);

        current.next.next = current;
        current.next = null;

        if(isInitialCall) {
            this.tail = this.head;
            this.head = newHead;
        }

        return newHead;
    }
    
    delete(value) {
        if (this.head === null) {
            return;
        }

        if (this.head.value === value) {
            this.head = this.head.next;

            if (this.head === null) {
                this.tail = null;
            }

            return;
        }

        let node = this.head;

        while (node.next !== null) {
            if (node.next.value === value) {
                if (node.next === this.tail) {
                    this.tail = node;
                }

                node.next = node.next.next;
                return;
            }

            node = node.next;
        }
    }

    clear() {
        this.head = null;
        this.tail = null;
    }
}

const list = new SinglyLinkedList();

const listContainer = document.getElementById("list-container");

// operation controls
const operationSelect = document.getElementById("operation-select");
const operationInput = document.getElementById("operation-input");
const runOperationButton = document.getElementById("run-operation");
const operationStatus = document.getElementById("operation-status");

// event listeners
runOperationButton.addEventListener("click", runOperation);
operationSelect.addEventListener("change", updateOperationInput);
updateOperationInput();

// animation variables
let searchSteps = [];
let currentSearchStep = 0;
let searchTimeout = null;
const searchDelay = 500;

let deleteSteps = [];
let currentDeleteStep = 0;
const deleteDelay = 500;
let deleteTimeout = null;

const insertDelay = 500;
let insertTimeout = null;

let orderedInsertSteps = [];
let currentOrderedInsertStep = 0;
let orderedInsertTimeout = null;
const orderedInsertDelay = 500;

const clearDelay = 500;
let clearTimer = null;
let clearNodes = [];
let currentClearStep = 0;

let reverseSteps = [];
let currentReverseStep = 0;
let reverseTimeout = null;
const reverseDelay = 500;
let reversedLinks = 0;

function updateOperationInput() {
    const operation = operationSelect.value;

    if (operation === "clear" || operation === "reverse") {
        operationInput.style.display = "none";
    }
    else {
        operationInput.style.display = "";
    }
}

function runOperation() {
    if (deleteTimeout !== null) {
        clearTimeout(deleteTimeout);
        deleteTimeout = null;
    }

    if (searchTimeout !== null) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
    }

    if (insertTimeout !== null) {
        clearTimeout(insertTimeout);
        insertTimeout = null;
    }

    if (orderedInsertTimeout !== null) {
        clearTimeout(orderedInsertTimeout);
        orderedInsertTimeout = null;
    }

    if (clearTimer !== null) {
        clearTimeout(clearTimer);
        clearTimer = null;
    }

    if (reverseTimeout !== null) {
        clearTimeout(reverseTimeout);
        reverseTimeout = null;
    }

    const operation = operationSelect.value;

    if (operation === "insert") {
        if (operationInput.value === "") {
            operationStatus.textContent = "Please enter a value.";

            return;
        }

        const value = Number(operationInput.value);

        list.insert(value);
        drawList(list.tail, "insert");

        operationStatus.textContent = `Inserting ${value} at the end of the list.`;

        insertTimeout = setTimeout(() => {
            drawList();

            operationStatus.textContent = `Inserted ${value} at the end of the list.`;
        }, insertDelay);
    }

    else if (operation === "insert-in-order") {
        if (operationInput.value === "") {
            operationStatus.textContent = "Please enter a value.";

            return;
        }

        const value = Number(operationInput.value);

        prepareOrderedInsert(value);
        playOrderedInsertStep(value);
    }

    else if (operation === "search") {
        if (operation.value === "") {
            operationStatus.textContent = "Please enter a value.";

            return;
        }

        const value = Number(operationInput.value);

        searchList(value);
        playSearchStep();
    }

    else if (operation === "delete") {
        if (operationInput.value === "") {
            operationStatus.textContent = "Please enter a value.";

            return;
        }

        const value = Number(operationInput.value);

        prepareDelete(value);
        playDeleteStep(value);
    }

    else if (operation === "clear") {
        animateClear();
    }

    else if (operation === "reverse") {
        prepareReverse();
        playReverseStep();
    }
}

function prepareReverse() {
    reverseSteps = [];
    currentReverseStep = 0;
    reversedLinks = 0;
    runOperationButton.disabled = true;

    let current = list.head;

    while (current !== null) {
        reverseSteps.push(current);
        current = current.next;
    }
}

function playReverseStep() {
    if (currentReverseStep >= reverseSteps.length) {
        reversedLinks = 0;
        playReverseUnwindStep();

        return;
    }

    const node = reverseSteps[currentReverseStep];

    drawList(node, "compare");

    operationStatus.textContent =
        `Visiting node containing ${node.value}.`;
    
    currentReverseStep++;

    reverseTimeout = setTimeout(
        playReverseStep,
        reverseDelay
    );
}

function playReverseUnwindStep() {
    const totalLinks = reverseSteps.length - 1;

    if (reversedLinks >= totalLinks) {
        list.reverse();
        drawList();

        operationStatus.textContent = "List reversed.";
        reverseTimeout = null;
        runOperationButton.disabled = false;

        return;
    }

    reversedLinks++;

    const node = reverseSteps[totalLinks - reversedLinks];

    drawList(
        node,
        "compare",
        Infinity,
        reversedLinks
    );

    operationStatus.textContent =
        `Reversing pointer from ${node.next.value} to ${node.value}.`;
    
    reverseTimeout = setTimeout(
        playReverseUnwindStep,
        reverseDelay
    );
}

function prepareOrderedInsert(value) {
    orderedInsertSteps = [];
    currentOrderedInsertStep = 0;

    let current = list.head;

    while (current !== null && current.value < value) {
        orderedInsertSteps.push({
            type: "compare",
            node: current
        });

        current = current.next;
    }

    orderedInsertSteps.push({
        type: "insert",
        node: current
    });
}

function playOrderedInsertStep(value) {
    if (currentOrderedInsertStep >= orderedInsertSteps.length) {
        return;
    }

    const step = orderedInsertSteps[currentOrderedInsertStep];

    if (step.type === "compare") {
        drawList(step.node, "compare");

        operationStatus.textContent = `Checking node containing ${step.node.value}.`;
    }
    else if (step.type === "insert") {
        const insertedNode = list.insertInOrder(value);

        drawList(insertedNode, "insert");

        operationStatus.textContent = `Inserting ${value} in ascending order.`;

        orderedInsertTimeout = setTimeout(() => {
            drawList();

            operationStatus.textContent = `Inserted ${value} in ascending order.`;
        }, orderedInsertDelay);

        return;
    }

    currentOrderedInsertStep++;

    if (currentOrderedInsertStep < orderedInsertSteps.length) {
        orderedInsertTimeout = setTimeout(
            () => playOrderedInsertStep(value),
            orderedInsertDelay
        );
    }
}

function prepareDelete(value) {
    deleteSteps = [];

    let current = list.head;

    while (current !== null) {
        deleteSteps.push({
            type: "compare",
            node: current
        });

        if (current.value === value) {
            deleteSteps.push({
                type: "delete",
                node: current
            });

            break;
        }

        current = current.next;
    }

    if (current === null) {
        deleteSteps.push({
            type: "not-found",
            node: null
        });
    }

    currentDeleteStep = 0;
}

function playDeleteStep(value) {
    if (currentDeleteStep >= deleteSteps.length) {
        return;
    }

    const step = deleteSteps[currentDeleteStep];

    if (step.type === "compare") {
        drawList(step.node, "compare");

        operationStatus.textContent = `Checking node containing ${step.node.value}.`;
    }
    else if (step.type === "delete") {
        drawList(step.node, "delete");

        operationStatus.textContent = `Deleting node containing ${step.node.value}.`;

        deleteTimeout = setTimeout(() => {
            list.delete(value);
            drawList();

            operationStatus.textContent = `Deleted ${value} from the list.`;
        }, deleteDelay);

        return;
    }
    else if (step.type === "not-found") {
        drawList();

        operationStatus.textContent = `${value} was not found in the list.`;
    }

    currentDeleteStep++;

    if (currentDeleteStep < deleteSteps.length) {
        deleteTimeout = setTimeout(
            () => playDeleteStep(value),
            deleteDelay
        );
    }
}

function searchList(value) {
    searchSteps = [];

    const result = list.search(value, (node) => {
        searchSteps.push({
            type: "compare",
            node: node
        });
    });

    if (result !== null) {
        searchSteps.push({
            type: "found",
            node: result
        });
    }
    else {
        searchSteps.push({
            type: "not-found",
            node: null
        });
    }

    currentSearchStep = 0;
}

function playSearchStep() {
    if (currentSearchStep >= searchSteps.length) {
        return;
    }

    const step = searchSteps[currentSearchStep];

    if (step.type === "compare") {
        drawList(step.node, "compare");

        operationStatus.textContent = `Checking node containing ${step.node.value}.`;
    }
    else if (step.type === "found") {
        drawList(step.node, "found");

        operationStatus.textContent = `Found ${step.node.value}.`;
    }
    else if (step.type === "not-found") {
        drawList();

        operationStatus.textContent = "Value not found in the list.";
    }

    currentSearchStep++;

    if (currentSearchStep < searchSteps.length) {
        searchTimeout = setTimeout(
            playSearchStep,
            searchDelay
        );
    }
}

function animateClear() {
   runOperationButton.disabled = true;

   clearNodes = [];

   let current = list.head;

   while (current !== null) {
        clearNodes.push(current);
        current = current.next;
   }

   currentClearStep = clearNodes.length - 1;
   
   playClearStep();
}

function playClearStep() {
    if (currentClearStep < 0) {
        list.clear();
        drawList();

        operationStatus.textContent = "List cleared.";
        clearTimer = null;

        runOperationButton.disabled = false;

        return;
    }

    const node = clearNodes[currentClearStep];

    drawList(node, "delete", currentClearStep + 1);

    operationStatus.textContent =
        `Clearing node containing ${node.value}.`;
    
    clearTimer = setTimeout(() => {
        currentClearStep--;
        playClearStep();
    }, clearDelay);
}

function drawList(
    highlightedNode = null,
    highlightType = "compare",
    visibleCount = Infinity,
    reversedLinksCount = 0) {
    listContainer.innerHTML = "";

    let current = list.head;
    let count = 0;

    const isLastVisibleNode = (node) => {
        return node.next === null || count === visibleCount - 1;
    };

    while (current !== null && count < visibleCount) {
        const nodeElement = document.createElement("div");

        if (current === highlightedNode) {
            if (highlightType === "found") {
                nodeElement.classList.add("list-found");
            }
            else if (highlightType === "delete") {
                nodeElement.classList.add("list-delete");
            }
            else if (highlightType === "insert") {
                nodeElement.classList.add("list-insert");
            }
            else {
                nodeElement.classList.add("list-search");
            }
        }

        const nodeWrapper = document.createElement("div");
        nodeWrapper.classList.add("node-wrapper");

        if (current === list.head) {
            nodeElement.classList.add("list-head");
        }

        if (isLastVisibleNode(current)) {
            nodeElement.classList.add("list-tail");
        }

        const label = document.createElement("div");
        label.classList.add("node-label");

        if (current === list.head && isLastVisibleNode(current)) {
            label.textContent = "HEAD / TAIL";
        }
        else if (current === list.head) {
            label.textContent = "HEAD";
        }
        else if (isLastVisibleNode(current)) {
            label.textContent = "TAIL";
        }

        nodeElement.classList.add("list-node");
        nodeElement.textContent = current.value;

        nodeWrapper.appendChild(label);
        nodeWrapper.appendChild(nodeElement);
        listContainer.appendChild(nodeWrapper);

        if (!isLastVisibleNode(current)) {
            const totalLinks = reverseSteps.length - 1;
            const reverseStartIndex = totalLinks - reversedLinksCount;

            const arrow = reversedLinksCount > 0 && count >= reverseStartIndex
                ? createReverseArrow()
                : createArrow();
            
            listContainer.appendChild(arrow);
        }

        current = current.next;
        
        count++;
    }

    if (list.tail !== null && visibleCount > 0) {
        const nullArrow = createArrow();

        const nullLabel = document.createElement("div");
        nullLabel.classList.add("null-label");
        nullLabel.textContent = "NULL";

        listContainer.appendChild(nullArrow);
        listContainer.appendChild(nullLabel);
    }
}

function createArrow() {
    const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    arrow.setAttribute("viewBox", "0 0 60 20");
    arrow.classList.add("list-arrow");

    arrow.innerHTML = `
        <line
            x1="0"
            y1="10"
            x2="60"
            y2="10"
            stroke="currentColor"
            stroke-width="2"
        />
        <path
            d="M 52 4 L 60 10 L 52 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        />
    `;

    return arrow;
}

function createReverseArrow() {
    const arrow = createArrow();
    
    arrow.innerHTML = `
        <g transform="rotate(180 30 10)">
            ${arrow.innerHTML}
        </g>
    `;

    return arrow;
}

list.insert(10);
list.insert(20);
list.insert(40);

drawList();