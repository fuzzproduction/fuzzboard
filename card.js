class Card {
  constructor(type) {
    this.type = type;
  }
}

class CardStack {
  constructor() {
    this.stack = [];
    this.initStack();
  }

  initStack() {
    const initialCardTypes = ["Dragon", "Goblin", "Princess"];
    initialCardTypes.forEach((type) => this.addCard(type));
  }

  addCard(type) {
    const card = new Card(type);
    this.stack.push(card);
  }

  draw() {
    if (this.isEmpty()) {
      console.log("The card stack is empty.");
      return null;
    }
    return this.stack.pop().type;
  }

  shuffle() {
    for (let i = this.stack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.stack[i], this.stack[j]] = [this.stack[j], this.stack[i]];
    }
  }

  isEmpty() {
    return this.stack.length === 0;
  }

  cardCount() {
    return this.stack.length;
  }

  peek() {
    if (this.isEmpty()) {
      console.log("The card stack is empty.");
      return null;
    }
    return this.stack[this.stack.length - 1].type;
  }

  peekRemainingCards() {
    return this.stack.map((card) => card.type);
  }
}

module.exports = {
  Card,
  CardStack,
};
