//function rollDice() {
//  return 1 + Math.floor(Math.random() * 6);
//}
const readline = require("readline");

const Graph = require("./graph");
const Player = require("./player");
const CardStack = require("./card"); // import the CardStack class

class FuzzModernGame {
  constructor(numPlayers) {
    if (numPlayers < 2 || numPlayers > 6) {
      throw new Error("The number of players must be between 2 and 6.");
    }

    this.board = new Graph(Graph.UNDIRECTED);
    this.initBoard();
    this.players = [];
    this.cardStack = new CardStack(); // Initialize the card stack

    this.initPlayers(numPlayers);
  }

  initBoard() {
    // Create locations (vertices)
    const a = this.board.addVertex("A");
    const b = this.board.addVertex("B");
    const c = this.board.addVertex("C");
    const d = this.board.addVertex("D");
    const e = this.board.addVertex("E");
    const f = this.board.addVertex("F");
    const g = this.board.addVertex("G");
    const h = this.board.addVertex("H");
    const i = this.board.addVertex("I");

    // Create paths (edges)
    this.board.addEdge(b, a, 1);
    this.board.addEdge(b, e, 1);
    this.board.addEdge(c, e, 1);
    this.board.addEdge(c, h, 1); // Adding new edge between C and H
    this.board.addEdge(d, e, 1); // Added new edge between D and E
    this.board.addEdge(e, f, 1);
    this.board.addEdge(f, g, 1);
    this.board.addEdge(f, h, 1);
    this.board.addEdge(g, i, 1);
    this.board.addEdge(g, h, 1);

    console.log(this.board.toString());
    console.log(
      "Adjacency list for A:",
      this.board.nodes
        .get("A")
        .getAdjacents()
        .map((node) => node.value)
    );
  }

  initPlayers(numPlayers) {
    for (let i = 1; i <= numPlayers; i++) {
      const newPlayer = new Player(`Player ${i}`, this.getInitialPosition());
      console.log(
        `Initialized ${newPlayer.name} at position ${
          newPlayer.getPosition().value
        }`
      );
      this.players.push(newPlayer);
    }
  }

  getInitialPosition() {
    // Return the initial position as a Node object, not by adding a new vertex.
    return this.board.nodes.get("A");
  }
  startGame() {
    let currentPlayerIndex = 0;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = (query) => {
      return new Promise((resolve) =>
        rl.question(query, (ans) => resolve(ans))
      );
    };

    const gameLoop = async () => {
      while (!this.isGameOver()) {
        const currentPlayer = this.players[currentPlayerIndex];

        console.log(`It's ${currentPlayer.name}'s turn.`);

        const action = await this.waitForPlayerAction(
          askQuestion,
          currentPlayer
        );
        this.processPlayerAction(currentPlayer, action);

        if (this.isGameOver()) {
          this.endGame();
          rl.close();
          return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
      }
    };

    gameLoop();
  }

  isGameOver() {
    // The game is over if the card stack is empty
    return this.cardStack.isEmpty();
  }

  declareWinner() {
    // Find the player with the most number of cards guessed correctly
    let winner = null;
    let maxCards = -1;
    this.players.forEach((player) => {
      if (player.getCorrectGuessCount() > maxCards) {
        maxCards = player.getCorrectGuessCount();
        winner = player;
      }
    });

    console.log(
      `The winner is ${winner.name} with ${maxCards} correctly guessed cards.`
    );
  }

  endGame() {
    // Wrap up the game
    this.declareWinner();
    console.log("Game Over.");
    // Additional clean-up if necessary
  }

  async waitForPlayerAction(ask, player) {
    const currentPosition = player.getPosition();

    // Add debug line here to inspect the player's position object
    console.log("Player's position object:", player.position);
    console.log("Player's current position:", player.position.value);

    let validAction = false;
    let action;

    while (!validAction) {
      const currentPosition = player.position;
      const adjacentPositions = currentPosition
        .getAdjacents()
        .map((node) => node.value);

      action = await ask(
        `You are at position ${
          player.position
        }. Where do you want to move? Adjacent positions are: ${adjacentPositions.join(
          ", "
        )}. `
      );

      // Convert the input to uppercase
      console.log("DEBUG: User action is ", action);
      action = action.toUpperCase();

      validAction = this.isValidMove(player, action);

      if (!validAction) {
        console.log(`Invalid move. You can only move to adjacent positions.`);
      }
    }

    return action;
  }

  // Add this new function
  isValidMove(player, action) {
    const currentPosition = player.getPosition();
    const adjacentPositions = currentPosition
      .getAdjacents()
      .map((node) => node.value);

    console.log("DEBUG: Adjacent positions are ", adjacentPositions);

    return adjacentPositions.includes(action);
  }

  processPlayerAction(player, action) {
    if (this.isValidMove(player, action)) {
      console.log(`${player.name} moves to ${action}.`);
      player.updatePosition(this.board.nodes.get(action)); // Use updatePosition method

      // For demonstration, let's assume drawing a card when a player moves
      const card = this.cardStack.drawCard();
      if (card) {
        console.log(`${player.name} drew a ${card.type} card.`);
        player.incrementCorrectGuess(); // Use the incrementCorrectGuess method
      }

      return true;
    } else {
      return false;
    }
  }
}

const game = new FuzzModernGame(2); // Creates a new game with 2 players
game.startGame();

module.exports = FuzzModernGame;
