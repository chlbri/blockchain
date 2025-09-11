export {};

declare global {
  interface Number {
    /**
     * **N.B : Call this the file "src/features/numbers/overload/percentS.ts"**
     *
     * @returns the percent value of the number as a string (e.g., 10.percentS = "10%")
     */
    get percentS(): string;
  }
}

Object.defineProperty(Number.prototype, 'percentS', {
  get: function () {
    return `${this.toString()}%`;
  },
  configurable: false,
  enumerable: false,
});
