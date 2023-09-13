class Node {
  constructor(value) {
    this.value = value;
    this.adjacents = new Map(); // adjacency list with weights
    this.hiddenCard = null; // The type of card hidden in this node
  }

  addAdjacent(node, weight = 1) {
    this.adjacents.set(node, weight);
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

  logDetails() {
    console.log(`Node value: ${this.value}`);
    if (this.hiddenCard) {
      console.log(`Hidden card: ${this.hiddenCard.type}`);
    } else {
      console.log("No hidden card.");
    }
    console.log("Adjacents:");
    for (const [node, weight] of this.adjacents) {
      console.log(`  Node value: ${node.value}, Weight: ${weight}`);
    }
  }

  revealCard() {
    if (this.hiddenCard) {
      console.log(`Revealed a ${this.hiddenCard.type} card.`);
      return this.hiddenCard;
    } else {
      console.log("No card hidden in this node.");
      return null;
    }
  }
}

module.exports = Node;
