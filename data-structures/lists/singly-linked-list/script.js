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

    search(value) {
        let node = this.head

        while (node !== null) {
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
            return;
        }

        if (newNode.value <= this.head.value) {
            newNode.next = this.head;
            this.head = newNode;
            return;
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