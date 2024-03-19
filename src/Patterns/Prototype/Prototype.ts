type cloneCallback = (clone: Dog) => typeof Dog;

/**
 * Using inheritence is just for demonstration
 * Showcasing that it works in all scenarios
 */
class Animal {
  _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return `My name is ${this._name}!`;
  }
  set name(name) {
    this._name = name;
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  bark() {
    return "woof!";
  }

  __clone(fn: cloneCallback) {
    const clone = Object.create(this);
    return fn(clone);
  }
}

type cloneWizardCallback = (clone: Wizard) => typeof Wizard;

const Wizard = {
  name: "",
  castASpell(spell: string) {
    return `I invoke the spell: ${spell}`;
  },
  __clone(fn: cloneWizardCallback | undefined): unknown {
    const clone = { ...this };
    return fn ? fn(clone) : clone;
  },
};

export { Wizard, Dog };
