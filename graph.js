const Node = require("./node");

class Graph {
  static get UNDIRECTED() {
    return Symbol("undirected");
  }

  static get DIRECTED() {
    return Symbol("directed");
  }

  constructor(edgeDirection = Graph.UNDIRECTED) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addNode(value) {
    if (!this.nodes.has(value)) {
      const newNode = new Node(value);
      this.nodes.set(value, newNode);
    }
  }

  removeNode(value) {
    const node = this.nodes.get(value);
    if (node) {
      for (const adj of node.getAdjacents()) {
        this.removeEdge(value, adj.value);
      }
      this.nodes.delete(value);
    }
  }

  addEdge(sourceNodeValue, destinationNodeValue, weight = 1) {
    const sourceNode = this.nodes.get(sourceNodeValue);
    const destinationNode = this.nodes.get(destinationNodeValue);

    if (sourceNode && destinationNode) {
      sourceNode.addAdjacent(destinationNode, weight);
      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.addAdjacent(sourceNode, weight);
      }
    }
  }

  removeEdge(sourceNodeValue, destinationNodeValue) {
    const sourceNode = this.nodes.get(sourceNodeValue);
    const destinationNode = this.nodes.get(destinationNodeValue);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);
      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.removeAdjacent(sourceNode);
      }
    }
  }

  findNodesAtDistance(startNode, distance) {
    const visited = new Set();
    const queue = [{ node: startNode, distance: 0 }];
    const nodesAtDistance = [];

    while (queue.length > 0) {
      const { node, distance: currentDistance } = queue.shift();
      visited.add(node);

      if (currentDistance === distance) {
        nodesAtDistance.push(node);
      }

      if (currentDistance < distance) {
        for (const adj of node.getAdjacents()) {
          if (!visited.has(adj)) {
            queue.push({ node: adj, distance: currentDistance + 1 });
          }
        }
      }
    }

    return nodesAtDistance;
  }

  distributeCards(cardTypes, specificNodes = null) {
    if (specificNodes) {
      for (const [nodeValue, cardType] of Object.entries(specificNodes)) {
        const node = this.nodes.get(nodeValue);
        if (node) {
          node.hiddenCard = { type: cardType };
        }
      }
    } else {
      const nodeArray = Array.from(this.nodes.values());
      for (const cardType of cardTypes) {
        const randomIndex = Math.floor(Math.random() * nodeArray.length);
        const node = nodeArray[randomIndex];
        node.hiddenCard = { type: cardType };
      }
    }
  }

  logDetails() {
    for (const [_, node] of this.nodes) {
      node.logDetails();
    }
  }
}

module.exports = Graph;
