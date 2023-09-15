const Graph = require("./graph");
const Node = require("./node");
const Player = require("./player");
const { CardStack } = require("./card");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const graph = new Graph(Graph.UNDIRECTED);
  const nodes = ["A", "B", "C", "D", "E", "S"];
  nodes.forEach((node) => graph.addNode(node));
  graph.addEdge("A", "B");
  graph.addEdge("B", "C");
  graph.addEdge("C", "D");
  graph.addEdge("D", "E");
  graph.addEdge("E", "S");

  const cardTypes = ["Dragon", "Goblin", "Princess"];
  graph.distributeCards(cardTypes);

  const numPlayers = await promptUser("How many players? (2-6): ");
  if (numPlayers < 2 || numPlayers > 6) {
    console.log("Invalid number of players. Exiting.");
    rl.close();
    return;
  }

  const players = [];
  for (let i = 0; i < numPlayers; i++) {
    const name = await promptUser(`Enter name for player ${i + 1}: `);
    const initialNode = graph.nodes.get(nodes[i]);
    const player = new Player(name, initialNode);
    players.push(player);
  }

  const cardStack = new CardStack();
  console.log("Card stack is instantiated...");
  cardStack.shuffle();

  while (!cardStack.isEmpty()) {
    // Changed the loop condition
    for (const player of players) {
      console.log(`${player.name}'s turn.`);
      await promptUser("Press Enter to roll the dice...");
      await player.rollDiceAndMove(graph, promptUser);

      if (graph.isSpecialNode(player.position)) {
        await player.handleSpecialNode(graph, promptUser, cardStack);
      }

      // Check if the player is on a node with a hidden card
      if (player.position.hiddenCard) {
        await player.guessHiddenCard(player.position, cardStack, promptUser);
      }

      // Player info
      player.logDetails();

      // Check if the card stack is empty
      if (cardStack.isEmpty() || graph.getHiddenNodes().length === 0) {
        console.log("The game is over.");
        rl.close();
        return;
      }
    }
  }

  console.log("Game over.");
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
});
