import { describe, test, expect } from "vitest";
import { Wizard, Dog } from "./Prototype";

const dogName = "Sam";
const superDogName = "SuperSam";
const martianSuperDogName = "MartianSam";

const Sam = new Dog(dogName);

/**
 * Now we want to create new races derivated from Dog
 * SuperDog: An evolved Dog race that can fly
 * MartianSuperDog: An evolved race derivated from SuperDog from Mars
 */
const cloneToSuperDogFn = (Prototype) => {
  Prototype.fly = () => "Flying";
  return Prototype;
};
const cloneToMartianSuperDogFn = (Prototype) => {
  Prototype.isMartian = true;
  return Prototype;
};

/**
 * Don't eye brows, this is just like instanciating a new Object from a class
 * const SuperSam = new SuperDog()
 * Instead of new, we use the __clone function
 */
const SuperDog = Sam.__clone(cloneToSuperDogFn);
const SuperMartianDog = SuperDog.__clone(cloneToMartianSuperDogFn);

describe("Class cloning", () => {
  test("Init", () => {
    expect(Sam.name).toContain(dogName);
    expect(Sam.hasOwnProperty("fly")).toBe(false);
    expect(Sam.bark()).toContain("woof");
  });

  test("Simple cloning", () => {
    /**
     * Even while SuperSam is cloned from an Object
     * Actually we cloned the prototype not the Object
     */
    SuperDog.name = superDogName;

    // This is why the original Instance values didnt't move
    expect(Sam.name).not.toContain(superDogName);
    expect(SuperDog.name).toContain(superDogName);
    expect(SuperDog.hasOwnProperty("fly")).toBe(true);
    expect(SuperDog.bark()).toContain("woof");
  });

  test("Chained cloning", () => {
    SuperMartianDog.name = martianSuperDogName;

    // Original
    expect(Sam.name).toContain(dogName);
    expect(Sam.hasOwnProperty("fly")).toBe(false);
    expect(SuperDog.hasOwnProperty("isMartian")).toBe(false);
    expect(Sam.bark()).toContain("woof");
    // First Clone
    expect(SuperDog.name).toContain(superDogName);
    expect(SuperDog.hasOwnProperty("isMartian")).toBe(false);
    expect(SuperDog.bark()).toContain("woof");
    // Chained Clone
    expect(SuperMartianDog.name).toContain(martianSuperDogName);
    expect(SuperMartianDog.hasOwnProperty("isMartian")).toBe(true);
    expect(SuperMartianDog.bark()).toContain("woof");
  });
});

describe("Primitive Object cloning", () => {
  const JamesPotter = Wizard.__clone();
  JamesPotter.name = "James Potter";
  const HarryPotter = JamesPotter.__clone((Prototype) => {
    Prototype.hasAScar = true;
    return Prototype;
  });
  HarryPotter.name = "Harry Potter";

  test("init", () => {
    expect(JamesPotter.name).toBe("James Potter");
    expect(JamesPotter.hasOwnProperty("castASpell")).toBe(true);
    expect(JamesPotter.hasOwnProperty("hasAScar")).toBe(false);
  });

  test("Object cloning works", () => {
    expect(HarryPotter.name).toBe("Harry Potter");
    expect(HarryPotter.hasOwnProperty("castASpell")).toBe(true);
    expect(HarryPotter.hasOwnProperty("hasAScar")).toBe(true);
  });
});
