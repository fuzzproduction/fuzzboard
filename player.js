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

  async handleSpecialNode(graph, promptUser, cardStack) {
    // Peek at the top card of the stack
    const peekedCard = cardStack.peek();
    console.log(`You peeked at the top card: ${peekedCard}`);

    // Display all hidden nodes that still need to be discovered
    const hiddenNodes = graph.getHiddenNodes();
    console.log(
      `Hidden nodes still to be discovered: ${hiddenNodes.join(", ")}`
    );

    // Prompt the user to guess the node
    const guessNodeValue = await promptUser(
      "Guess the node where you think this card is: "
    );
    const guessedNode = graph.nodes.get(guessNodeValue);

    if (
      guessedNode &&
      guessedNode.hiddenCard &&
      guessedNode.hiddenCard.type === peekedCard
    ) {
      console.log("Correct guess! You get the card.");
      this.guessedCards++;
      cardStack.draw(peekedCard); // Remove the card from the stack
      guessedNode.revealCard(); // Reveal the card on the node
      console.log("State of all nodes after correct guess:");
      // TOREMOVE
      graph.logDetails(); // Assuming you have a method to log the details of all nodes
    } else {
      console.log("Wrong guess! Better luck next time.");
      cardStack.moveToBottom(); // Move the peeked card to the bottom of the stack
    }
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

      if (guess === node.hiddenCard.type) {
        console.log("Before draw, card stack:", cardStack.peekRemainingCards());
        this.guessedCards++;
        console.log("Correct guess! You get the card.");
        cardStack.draw(guess); // Remove the specific card from the stack
        console.log("After draw, card stack:", cardStack.peekRemainingCards());
        node.hiddenCard = null; // Remove the hidden card from the node
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
