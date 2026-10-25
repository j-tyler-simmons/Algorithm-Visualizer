class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    insert(value) {
        const newNode = new Node(value);

        if(this.head === null) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }

        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
    }

    traverseBackward() {
        let current = this.tail;

        while (current !== null) {
            console.log(current.value);
            current = current.prev;
        }
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
            else {
                this.head.prev = null;
            }

            return;
        }

        let current = this.head.next;

        while (current !== null) {
            if (current.value === value) {
                current.prev.next = current.next;

                if (current.next === null) {
                    this.tail = current.prev;
                }
                else {
                    current.next.prev = current.prev;
                }

                return;
            }

            current = current.next;
        }
    }

    search(value) {
        let current = this.head;

        while (current !== null) {
            if (current.value === value) {
                return current;
            }

            current = current.next;
        }

        return null;
    }

    reverse() {
        let current = this.head;

        while (current !== null) {
            const temp = current.next;

            current.next = current.prev;
            current.prev = temp;

            current = temp;
        }

        const temp = this.head;
        this.head = this.tail;
        this.tail = temp;
    }

    clear() {
        this.head = null;
        this.tail = null;
    }

    insertInOrder(value) {
        const newNode = new Node(value);

        // Case 1: Empty list
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;

            return newNode;
        }

        // Case 2: Insert at head
        if (value <= this.head.value) {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;

            return newNode;
        }

        // Case 3: Insert in middle or at tail
        let current = this.head;

        while (current.next !== null && current.next.value < value) {
            current = current.next;
        }

        newNode.next = current.next;
        newNode.prev = current;
        current.next = newNode;

        if (newNode.next === null) {
            this.tail = newNode;
        }
        else {
            newNode.next.prev = newNode;
        }

        return newNode;
    }
}

const listContainer = document.getElementById("list-container");

// Operation GUI
const operationSelect = document.getElementById("operation-select");
const operationInput = document.getElementById("operation-input");
const runOperationButton = document.getElementById("run-operation");
const operationStatus = document.getElementById("operation-status");

// Event Listeners
runOperationButton.addEventListener("click", runOperation);

// Animation variables
const insertDelay = 500;
let insertTimeout = null;

function createDoubleArrow() {
    const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    arrow.setAttribute("viewBox", "0 0 60 30");
    arrow.classList.add("list-arrow");

    arrow.innerHTML = `
        <line x1="0" y1="8" x2="60" y2="8"
              stroke="currentColor" stroke-width="2"/>
        <path d="M 52 2 L 60 8 L 52 14"
              fill="none" stroke="currentColor" stroke-width="2"/>

        <line x1="60" y1="22" x2="0" y2="22"
              stroke="currentColor" stroke-width="2"/>
        <path d="M 8 16 L 0 22 L 8 28"
              fill="none" stroke="currentColor" stroke-width="2"/>
    `;

    return arrow;
}

function createSingleArrow(pointLeft = false) {
    const arrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    arrow.setAttribute("viewBox", "0 0 60 20");
    arrow.classList.add("list-arrow");

    arrow.innerHTML = `
        <line x1="0" y1="10" x2="60" y2="10"
              stroke="currentColor" stroke-width="2"/>
        <path d="M 52 4 L 60 10 L 52 16"
              fill="none" stroke="currentColor" stroke-width="2"/>
    `;

    if (pointLeft) {
        arrow.innerHTML = `
            <g transform="rotate(180 30 10)">
                ${arrow.innerHTML}
            </g>
        `;
    }

    return arrow;
}

function drawList(highlightedNode = null, highlightType = "compare") {
    listContainer.innerHTML = "";

    if (list.head !== null) {
        const leftNull = document.createElement("div");
        leftNull.classList.add("null-label", "left-null");
        leftNull.textContent = "NULL";

        listContainer.appendChild(leftNull);
        listContainer.appendChild(createSingleArrow(true));
    }

    let current = list.head;

    while (current !== null) {
        const nodeWrapper = document.createElement("div");
        nodeWrapper.classList.add("node-wrapper");

        const nodeElement = document.createElement("div");
        nodeElement.classList.add("list-node");
        nodeElement.textContent = current.value;

        if (current === highlightedNode) {
            if (highlightType === "insert") {
                nodeElement.classList.add("list-insert");
            }
        }

        const label = document.createElement("div");
        label.classList.add("node-label");

        if (current === list.head && current === list.tail) {
            label.textContent = "HEAD / TAIL";
        }
        else if (current === list.head) {
            label.textContent = "HEAD";
        }
        else if (current === list.tail) {
            label.textContent = "TAIL";
        }

        if (current === list.head) {
            nodeElement.classList.add("list-head");
        }

        if (current === list.tail) {
            nodeElement.classList.add("list-tail");
        }

        nodeWrapper.appendChild(label);
        nodeWrapper.appendChild(nodeElement);
        listContainer.appendChild(nodeWrapper);

        if (current.next !== null) {
            listContainer.appendChild(createDoubleArrow());
        }

        current = current.next;
    }

    if (list.tail !== null) {
        const rightNull = document.createElement("div");
        rightNull.classList.add("null-label");
        rightNull.textContent = "NULL";

        listContainer.appendChild(createSingleArrow());
        listContainer.appendChild(rightNull);
    }
}

function runOperation() {
    const operation = operationSelect.value;

    if (operation === "insert") {
        if (operationInput.value === "") {
            operationStatus.textContent = "Please enter a value.";

            return;
        }

        const value = Number(operationInput.value);

        list.insert(value);
        drawList(list.tail, "insert");

        operationStatus.textContent = 
            `Inserting ${value} at the end of the list.`;
        
        runOperationButton.disabled = true;

        insertTimeout = setTimeout(() => {
            drawList();

            operationStatus.textContent =
                `Inserted ${value} at the end of the list.`;
            
            insertTimeout = null;
            runOperationButton.disabled = false;
        }, insertDelay);
    }
}

const list = new DoublyLinkedList();

list.insert(10);
list.insert(20);
list.insert(30);

drawList();