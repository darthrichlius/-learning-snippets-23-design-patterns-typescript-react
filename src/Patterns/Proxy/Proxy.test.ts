import { describe, test, expect } from "vitest";
import { Person, PersonProxy } from "./Proxy";

describe("PROXY", () => {
  // Avoiding a shallow copy thout would result in sharing the same reference

  test("Proxy Object and the Original are the same", () => {
    expect(PersonProxy.name).toBe(Person.name);
  });

  test("After change, Proxy Object and the Original are the same", () => {
    const newName = "Muhammad Ali";
    PersonProxy.name = newName;

    expect(PersonProxy.name).toBe(newName);
    expect(Person.name).toBe(newName);
  });

  test("After NOT VALID change, should trigger an Error", () => {
    // Attempt to set an invalid value
    const fnName = () => {
      PersonProxy.name = "a";
    };
    // Verify that the value remains unchanged
    expect(() => fnName()).toThrowError(
      "Only valid 'NAME' values are accepted"
    );

    // Attempt to set an invalid value
    const fnAge = () => {
      PersonProxy.age = -1;
    };
    expect(() => fnAge()).toThrowError("Only valid 'AGE' values are accepted");
  });

  test("After NOT VALID change, values stay unchanged", () => {
    const initialName = Person.name;
    const initialAge = Person.age;
    // Attempt to set an invalid value
    const fnName = () => {
      PersonProxy.name = "a";
    };
    // Attempt to set an invalid value
    const fnAge = () => {
      PersonProxy.age = -1;
    };
    expect(() => fnName()).toThrowError();
    expect(() => fnAge()).toThrowError();

    expect(PersonProxy.name).toBe(initialName);
    expect(PersonProxy.age).toBe(initialAge);
  });

  test("After VALID change, values are changed", () => {
    const initialName = Person.name;
    const initialAge = Person.age;
    // Attempt to set an invalid value
    const fnName = () => {
      PersonProxy.name = "CallMeMomo";
    };
    // Attempt to set an invalid value
    const fnAge = () => {
      PersonProxy.age = 45;
    };
    expect(() => fnName()).not.toThrowError();
    expect(() => fnAge()).not.toThrowError();

    expect(PersonProxy.name).not.toBe(initialName);
    expect(PersonProxy.age).not.toBe(initialAge);
  });
});
