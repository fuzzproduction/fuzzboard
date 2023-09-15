const Graph = require("../graph");
const Node = require("../node");
const Player = require("../player");
const { CardStack } = require("../card");

async function promptUser(question) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(question);
      resolve("Dragon"); // Simulated user input for testing
    }, 1000);
  });
}

async function main() {
  // Create graph
  const graph = new Graph(Graph.UNDIRECTED);
  const nodes = ["A", "B", "C", "D", "E", "F", "S"]; // Added "S" as a special node
  nodes.forEach((node) => graph.addNode(node));
  graph.addEdge("A", "B");
  graph.addEdge("B", "C");
  graph.addEdge("C", "D");
  graph.addEdge("D", "E");
  graph.addEdge("E", "F");
  graph.addEdge("F", "A");
  graph.addEdge("A", "S"); // Connect special node "S" to "A"

  // Distribute cards
  const cardTypes = ["Dragon", "Goblin", "Princess"];
  graph.distributeCards(cardTypes);

  // Create player
  const initialNode = graph.nodes.get("A");
  const player = new Player("TestPlayer", initialNode);

  // Create card stack
  const cardStack = new CardStack();
  cardStack.shuffle();

  // Simulate player's turn
  console.log(`${player.name}'s turn.`);
  player.logDetails();

  // Simulate moving to special node "S"
  const specialNode = graph.nodes.get("S");
  player.moveTo(specialNode);

  // Handle special node
  if (graph.isSpecialNode(player.position)) {
    await player.handleSpecialNode(graph, promptUser, cardStack);
  }

  // Log player details after the turn
  player.logDetails();
}

main().catch((err) => {
  console.error(err);
});
