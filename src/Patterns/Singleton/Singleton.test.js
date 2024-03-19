import { describe, expect, test } from "vitest";
import userCounter from "./user";
import { singletonCounterClass, singletonCounterObject } from "./Singleton";

describe("UNICITY", () => {
  test("Instance is UNIQUE", () => {
    const C1 = singletonCounterClass;
    const C2 = singletonCounterClass;
    expect(C1.getInstance() === C2.getInstance()).toBe(true);
  });

  test("Instance is IMMUTABLE", () => {
    const fn1 = () => {
      singletonCounterClass.newProp = "test";
    };
    const fn2 = () => {
      singletonCounterObject.newProp = "test";
    };
    expect(() => fn1()).toThrowError();
    expect(() => fn2()).toThrowError();
  });
});

describe("GLOBAL", () => {
  const CounterC = singletonCounterClass;
  const CounterO = singletonCounterObject;

  test("Initial OBJECT SingletonS starts at 1", () => {
    expect(CounterO.getCount()).toBe(1);
    expect(userCounter.getCount()).toBe(1);
  });

  test("Initial CLASS Singleton starts at 0", () => {
    expect(CounterC.getCount()).toBe(0);
  });

  test("Incrementing OBJECT SingletonS 1 time should be 2", () => {
    CounterO.increment();
    expect(CounterO.getCount()).toBe(2);
    expect(userCounter.getCount()).toBe(2);
  });

  test("Incrementing CLASS Singleton 1 time should be 1", () => {
    CounterC.increment();
    expect(CounterC.getCount()).toBe(1);
  });

  test("Incrementing 3 EXTRA time should be 5 for OBJECT & 4 for CLASS", () => {
    CounterC.increment();
    CounterC.increment();
    CounterC.increment();

    CounterO.increment();
    CounterO.increment();
    CounterO.increment();

    expect(CounterC.getCount()).toBe(4);
    expect(CounterO.getCount()).toBe(5);
  });

  test("Decrementing should be 3", () => {
    CounterC.decrement();

    userCounter.decrement();
    CounterO.decrement();

    expect(CounterC.getCount()).toBe(3);
    expect(CounterO.getCount()).toBe(3);
  });
});
