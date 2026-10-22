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

const list = new DoublyLinkedList();

list.insert(10);
list.insert(20);
list.insert(30);

const testOrdered = new DoublyLinkedList();

testOrdered.insertInOrder(20);
testOrdered.insertInOrder(40);
testOrdered.insertInOrder(10);
testOrdered.insertInOrder(30);

console.log(testOrdered.head.value);           // 10
console.log(testOrdered.head.next.value);      // 20
console.log(testOrdered.head.next.next.value); // 30
console.log(testOrdered.tail.value);           // 40

testOrdered.traverseBackward();
// Expected: 40, 30, 20, 10