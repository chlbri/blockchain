export {};

declare global {
  interface Number {
    get percent(): number;
    get percentS(): string;
  }
}

Object.defineProperty(Number.prototype, 'percent', {
  get: function () {
    return this.valueOf() / 100;
  },
  configurable: false,
  enumerable: false,
});

Object.defineProperty(Number.prototype, 'percentS', {
  get: function () {
    return `${this.toString()}%`;
  },
  configurable: false,
  enumerable: false,
});
