const Node = require("./node");

class Player {
  constructor(name, initialPosition) {
    // Initialize player's name
    this.name = name;

    // Initialize player's position on the board as a Node object
    this.position = initialPosition;

    // Initialize the count of correctly guessed cards to 0
    this.correctGuessCount = 0;
  }

  // Method to update the player's position on the board
  updatePosition(newPosition) {
    if (newPosition instanceof Node) {
      // Assuming Node is imported or globally available
      this.position = newPosition;
    } else {
      throw new Error("The new position must be a Node object.");
    }
  }

  // Method to increment the count of correctly guessed cards
  incrementCorrectGuess() {
    this.correctGuessCount++;
  }

  // Method to get the current position of the player on the board
  getPosition() {
    return this.position;
  }

  // Method to get the current count of correctly guessed cards
  getCorrectGuessCount() {
    return this.correctGuessCount;
  }
}

module.exports = Player;
