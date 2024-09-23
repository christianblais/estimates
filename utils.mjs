 /**
  * @returns A element picked at random
  */
Array.prototype.pick = function() {
  return this[Math.floor(Math.random() * this.length)];
}
