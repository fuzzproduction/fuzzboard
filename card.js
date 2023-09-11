class Card {
  constructor(type) {
    this.type = type;
  }
}

class CardStack {
  constructor() {
    this.stack = [];
    // Initialize stack with different types of cards
    const cardTypes = ["Dragon", "Princess", "Goblin"];
    cardTypes.forEach((type) => {
      this.stack.push(new Card(type));
    });
    this.shuffle();
  }

  shuffle() {
    for (let i = this.stack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.stack[i], this.stack[j]] = [this.stack[j], this.stack[i]];
    }
  }

  drawCard() {
    return this.stack.pop();
  }

  isEmpty() {
    return this.stack.length === 0;
  }
}

module.exports = CardStack;
