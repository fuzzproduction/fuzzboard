const Node = require("./node");
const Queue = require("./queue");

class Graph {
  constructor(edgeDirection = Graph.UNDIRECTED) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addVertex(value) {
    // Create the node by adding it to the nodes map if it doesn't exist
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      const vertex = new Node(value);
      // Create the key/value pair and add it to the nodes map
      this.nodes.set(value, vertex);
      console.log(`Vertex added: ${value}`);
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.nodes.get(value);
    // if the node is used in an adjacent node (edges) remove it
    if (current) {
      for (const node of this.nodes.values()) {
        node.removeAdjacent(current);
      }
    }
    return this.nodes.delete(value);
  }

  addEdge(source, destination, weight = 1) {
    const sourceNode = this.addVertex(source); // Fetch or create node
    const destinationNode = this.addVertex(destination); // Fetch or create node

    sourceNode.addAdjacent(destinationNode, weight);
    console.log(
      `Adding adjacent node with value: ${destination} and weight: ${weight}`
    );

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode, weight);
    }

    console.log(
      `Edge added between ${source} and ${destination} with weight ${weight}`
    );
    console.log(
      `Current adjacency list for ${source}:`,
      sourceNode.getAdjacents().map((n) => n.value)
    );
    console.log("SourceNode Instance:", sourceNode);
    console.log("DestinationNode Instance:", destinationNode);
    return [sourceNode, destinationNode];
  }

  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);

      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.removeAdjacent(sourceNode);
      }
    }
    return [sourceNode, destinationNode];
  }

  *bfs(first) {
    const visited = new Map();
    const visitList = new Queue();

    visitList.add(first);

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        yield node;
        visited.set(node, true);
        node.getAdjacents().forEach((adj) => visitList.add(adj));
      }
    }
  }

  toString() {
    let graphString = "";
    for (const [key, node] of this.nodes) {
      graphString += `Vertex: ${key}, Adjacent vertices: `;
      node.getAdjacents().forEach((adj) => {
        graphString += `${adj.value}, `;
      });
      graphString += "\n";
    }
    return graphString;
  }
}

Graph.UNDIRECTED = Symbol("undirected graph"); // two-ways edges
Graph.DIRECTED = Symbol("directed graph"); // one-way edges

module.exports = Graph;
