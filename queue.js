const LinkedList = require("./linkedList");
/**
 * Data structure where add and remove elements in a first-in, first-out (FIFO)
 */

class Queue {
  constructor() {
    this.items = new LinkedList();
  }
  enqueue(item) {
    this.items.addLast(item);
    return this;
  }
  dequeue() {
    return this.items.removeFirst();
  }
  get size() {
    return this.items.size;
  }
  isEmpty() {
    return !this.items.size;
  }
}

Queue.prototype.add = Queue.prototype.enqueue;
Queue.prototype.remove = Queue.prototype.dequeue;

module.exports = Queue;
