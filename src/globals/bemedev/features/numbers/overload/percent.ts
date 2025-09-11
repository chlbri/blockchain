export {};

declare global {
  interface Number {
    /**
     * **N.B : Call this the file "src/features/numbers/overload/percent.ts"**
     *
     * @returns the percent value of the number (e.g., 10.percent = 0.1)
     */
    get percent(): number;
  }
}

Object.defineProperty(Number.prototype, 'percent', {
  get: function () {
    return this.valueOf() / 100;
  },
  configurable: false,
  enumerable: false,
});
