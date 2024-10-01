export class RollingWord extends HTMLElement {
  ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' '];

  static observedAttributes = ['list', 'speed', 'duration', 'alphabet', 'length'];

  /**
   * The list of available words
   * @type string[]
   */
  #words;

  /**
   * The speed at which we swap characters, in milliseconds
   * @type Number
   */
  #speed;

  /**
   * Duration of the rolling effect before settling on a word, in milliseconds
   * @type Number
   */
  #duration;

  /**
   * Available alphabet from which we can pick random chars
   * @type string[]
   */
  #alphabet;

  /**
   * The number of rolling chars to generate
   * @type Number
   */
  #length;

  /**
   * Flag to determine whether or not this component is active
   * @type boolean
   */
  #isActive = false;

  /**
   * References to the setInterval used to roll characters
   * @type number
   */
  #interval;

  attributeChangedCallback(name, _, value) {
    switch (name) {
      case 'list':
        this.#words = Array.from(document.querySelectorAll(`#${this.getAttribute('list')} option`)).map(option => option.innerText);
        break;
      case 'speed':
        this.#speed = Number(value);
        break;
      case 'duration':
        this.#duration = Number(value);
        break;
      case 'duration':
        this.#duration = Number(value);
        break;
      case 'alphabet':
        this.#alphabet = value.split(',');
        break;
      case 'length':
        this.#length = Number(value);
        break;
    }
  }

  connectedCallback() {
    // While the list of available words might be provided by a `list` attribute,
    // it may also be defined with an inner datalist tag. The list has priority.
    this.#words ??= Array.from(this.querySelectorAll(`datalist option`)).map(option => option.innerText);

    // Upon instantiation, start rolling a first word
    this.roll();
  }

  get words() {
    return this.#words;
  }

  get speed() {
    return this.#speed ?? 100;
  }

  get duration() {
    return this.#duration ?? 1000;
  }

  get length() {
    return this.#length ?? 10;
  }

  get alphabet() {
    return this.#alphabet ?? this.ALPHABET;
  }

  /**
   * @param array {Array} An array
   * @returns {any} An element picked at random from array
   */
  #pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Update the word with some random characters
   */
  #tick() {
    this.innerText = [...Array(this.length).keys()].map(() => this.#pick(this.alphabet)).join('');
  }

  /**
   * Stop rolling characters and stabilize on a given word
   */
  #done() {
    // Make sure we stop rolling the characters
    clearInterval(this.#interval);

    // Stabilize with one of the available words, picked at random
    this.innerText = this.#pick(this.words);

    // Indicate that we're done
    this.#isActive = false;
  }

  /**
   * Start rolling the characters
   */
  roll() {
    // If we're currently active, abort, and let the previous roll complete
    if (this.#isActive) { return }

    // Setup the routine to start rolling the characters
    this.#interval = setInterval(this.#tick.bind(this), this.speed);

    // Setup the routine to stabilize the word once we're done
    setTimeout(this.#done.bind(this), this.duration);

    // Indicate that we're currently rolling
    this.#isActive = true;
  }
}

window.customElements.define('rolling-word', RollingWord);
