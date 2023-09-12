class Node {
  constructor(value) {
    this.value = value;
    this.adjacents = new Map(); // adjacency list with weights
  }

  addAdjacent(node, weight = 1) {
    this.adjacents.set(node, weight);
    console.log(`Added adjacent: `, node);
    console.log(
      `Current Adjacency List: `,
      Array.from(this.adjacents.keys()).map((n) => n.value)
    );
  }

  removeAdjacent(node) {
    if (this.adjacents.has(node)) {
      this.adjacents.delete(node);
      return node;
    }
    return null;
  }

  getAdjacents() {
    return Array.from(this.adjacents.keys());
  }

  getWeight(adjacentNode) {
    return this.adjacents.get(adjacentNode) || 0;
  }

  isAdjacent(node) {
    return this.adjacents.has(node);
  }

  toString() {
    const adjValues = Array.from(this.adjacents.keys())
      .map((node) => node.value)
      .join(", ");
    return `Node(value: ${this.value}, adjacents: [${adjValues}])`;
  }
}

module.exports = Node;
