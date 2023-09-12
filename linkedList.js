const Node = require("./node");

class LinkedList {
  constructor() {
    this.first = null; // head/root element
    this.last = null; // last element of the list
    this.size = 0; // total number of elements in the list
  }

  addLast(value) {
    const newNode = new Node(value);

    if (this.first) {
      newNode.previous = this.last;
      this.last.next = newNode;
      this.last = newNode;
    } else {
      this.first = newNode;
      this.last = newNode;
    }

    this.size += 1;

    return newNode;
  }

  removeFirst() {
    const head = this.first;

    if (head) {
      this.first = head.next;
      if (this.first) {
        this.first.previous = null;
      } else {
        this.last = null;
      }
      this.size -= 1;
    }
    return head && head.value;
  }
}
module.exports = LinkedList;
