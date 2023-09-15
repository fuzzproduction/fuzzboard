const Graph = require("../graph");
const Node = require("../node");
const Player = require("../player");
const { CardStack } = require("../card");

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

async function testGuessingMechanism() {
  // Create graph and nodes
  const graph = new Graph(Graph.UNDIRECTED);
  const nodes = ["A", "B", "C"];
  nodes.forEach((node) => graph.addNode(node));
  graph.addEdge("A", "B");
  graph.addEdge("B", "C");
  graph.addEdge("C", "A");

  // Distribute cards
  const cardTypes = ["Dragon", "Goblin"];
  graph.distributeCards(cardTypes);

  // Create player
  const initialNode = graph.nodes.get("A");
  const player = new Player("TestPlayer", initialNode);

  // Create card stack
  const cardStack = new CardStack();
  cardStack.shuffle();

  // Test guessing mechanism
  console.log(`${player.name}'s turn.`);
  player.logDetails();

  if (player.position.hiddenCard) {
    const remainingCards = cardStack.peekRemainingCards();
    const guess = await promptUser(
      `Guess the hidden card (Options: ${remainingCards.join(", ")}): `
    );

    if (guess === player.position.hiddenCard.type) {
      player.guessCard();
      console.log("Correct guess! You get the card.");
      cardStack.draw(); // Remove the card from the stack
      player.position.revealCard(); // Reveal the card on the node
    } else {
      console.log("Wrong guess! Better luck next time.");
    }
  }

  player.logDetails();

  rl.close();
}

testGuessingMechanism().catch((err) => {
  console.error(err);
  rl.close();
});
