/**
 * SINGLETON - Share a single global instance throughout the application
 *
 * SINGLETON is a contraversial pattern
 *    - Tight coupling in the code make testing and refactoring tedious
 *    - Use global state leading to unexpected behavior
 *
 * But it has some ADVANTAGES
 *    - Modularity
 *    - Single Source of truth
 *    - Performance improvement (debatable as in JS object are reference)
 */

let instance: Counter;
let counterC: number = 0;
let counterO: number = 0;

/**
 * In JS, using a class for Singleton is overkill
 * Using a class is done just for the purpose of a demonstration
 */
class Counter {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance");
    }
    // @ts-ignore
    instance = this;
  }

  getInstance() {
    return this;
  }

  getCount() {
    return counterC;
  }

  increment() {
    return ++counterC;
  }

  decrement() {
    return --counterC;
  }
}

export const singletonCounterClass = Object.freeze(new Counter());

export const singletonCounterObject = Object.freeze({
  getCount: () => counterO,
  increment: () => ++counterO,
  decrement: () => --counterO,
});

// or export { singletonCounterClass, singletonCounterObject }
