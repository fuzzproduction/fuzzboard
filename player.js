class Player {
  constructor(name, initialPosition) {
    this.name = name;
    this.position = initialPosition; // A node from the graph representing the player's position
    this.guessedCards = 0; // Number of guessed cards
  }

  moveTo(newPosition) {
    this.position = newPosition;
    console.log(`${this.name} moved to position ${newPosition.value}`);
  }

  guessCard() {
    this.guessedCards++;
    console.log(
      `${this.name} guessed a card. Total guessed cards: ${this.guessedCards}`
    );
  }

  async rollDiceAndMove(graph, promptUser) {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    console.log(`${this.name} rolled a ${diceRoll}`);

    const possibleNodes = graph.findNodesAtDistance(this.position, diceRoll);

    if (possibleNodes.length === 0) {
      console.log(
        `No nodes at distance ${diceRoll}. ${this.name} stays at the same position.`
      );
      return;
    }

    if (possibleNodes.length === 1) {
      this.moveTo(possibleNodes[0]);
      return;
    }

    console.log(
      `Possible nodes to move to: ${possibleNodes
        .map((node) => node.value)
        .join(", ")}`
    );
    const selectedNodeValue = await promptUser(
      `Which node would you like to move to? `
    );

    const selectedNode = possibleNodes.find(
      (node) => node.value === selectedNodeValue
    );

    if (selectedNode) {
      this.moveTo(selectedNode);
    } else {
      console.log(`Invalid choice. ${this.name} stays at the same position.`);
    }
  }

  async guessHiddenCard(node, cardStack, promptUser) {
    if (node.hiddenCard) {
      const remainingCards = cardStack.peekRemainingCards();
      const guess = await promptUser(
        `Guess the hidden card (Options: ${remainingCards.join(", ")}): `
      );

      if (guess === node.hiddenCard) {
        this.guessedCards++;
        console.log("Correct guess! You get the card.");
        cardStack.draw(); // Remove the card from the stack
        node.revealCard(); // Reveal the card on the node
      } else {
        console.log("Wrong guess! Better luck next time.");
      }
    }
  }

  logDetails() {
    console.log(`Player: ${this.name}`);
    console.log(`Position: ${this.position.value}`);
    console.log(`Guessed Cards: ${this.guessedCards}`);
  }
}

module.exports = Player;
