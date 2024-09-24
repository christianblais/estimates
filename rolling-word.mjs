import './utils.mjs';

export class RollingWord extends HTMLElement {
  ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' '];

  constructor() {
    super();

    /**
     * The list of options picked from the specified datalist
     * @type NodeListOf<HTMLOptionElement>
     */
    let options;

    if (this.hasAttribute('list')) {
      options = document.querySelectorAll(`#${this.getAttribute('list')} option`);
    } else {
      options = this.querySelectorAll('datalist option');
    }

    if (options.length === 0) {
      throw new SyntaxError('RollingWord elements must define a datalist');
    }

    /**
     * The list of available words
     * @type string[]
     */
    this.words = Array.from(options).map(option => option.innerText);

    /**
     * The speed at which we swap characters, in milliseconds
     * @type Number
     */
    this.speed = this.hasAttribute('speed') ? Number(this.getAttribute('speed')) : 100;

    /**
     * Duration of the rolling effect before settling on a word, in milliseconds
     * @type Number
     */
    this.duration = this.hasAttribute('duration') ? Number(this.getAttribute('duration')) : 750;

    /**
     * Available alphabet from which we can pick random chars
     * @type Number
     */
    this.alphabet = this.hasAttribute('alphabet') ? this.getAttribute('alphabet').split(',') : this.ALPHABET;

    /**
     * The number of rolling chars to generate
     * @type Number
     */
    this.chars = this.hasAttribute('chars') ? Number(this.getAttribute('chars')) : 10;

    /**
     * Flag to determine whether or not this component is active
     * @type boolean
     */
    this.isActive = false;
  }

  connectedCallback() {
    // Upon instantiation, start rolling a first word
    this.roll();
  }

  /**
   * Update the word with some random characters
   * @private
   */
  tick() {
    // Update the text with some random characters
    this.innerText = [...Array(this.chars).keys()].map(() => this.alphabet.pick()).join('');
  }

  /**
   * Stop rolling characters and stabilize on a given word
   * @private
   */
  done() {
    // Make sure we stop rolling the characters
    clearInterval(this.interval);

    // Stabilize with one of the available words, picked at random
    this.innerText = this.words.pick();

    // Indicate that we're done
    this.isActive = false;
  }

  /**
   * Start rolling the characters
   */
  roll() {
    // If we're currently active, abort, and let the previous roll complete
    if (this.isActive) { return }

    // Setup the routine to start rolling the characters
    this.interval = setInterval(this.tick.bind(this), this.speed);

    // Setup the routine to stabilize the word once we're done
    setTimeout(this.done.bind(this), this.duration);

    // Indicate that we're currently rolling
    this.isActive = true;
  }
}
