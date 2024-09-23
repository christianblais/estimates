import './utils.mjs';

export class RollingWord extends HTMLElement {
  LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' '];

  constructor() {
    super();

    let options;

    if (this.hasAttribute('list')) {
      options = document.querySelectorAll(`#${this.getAttribute('list')} option`);
    } else {
      options = this.querySelectorAll('datalist option');
    }

    if (options.length === 0) {
      throw new SyntaxError('RollingWord elements must define a datalist');
    }

    this.words = Array.from(options).map(option => option.innerText);
  }

  connectedCallback() {
    this.roll();
  }

  roll() {
    const timeout = setInterval(() => {
      this.innerText = [...Array(10).keys()].map(() => this.LETTERS.pick()).join('')
    }, 100);

    setTimeout(() => {
      clearInterval(timeout);
      this.innerText = this.words.pick();
    }, 750);
  }
}
