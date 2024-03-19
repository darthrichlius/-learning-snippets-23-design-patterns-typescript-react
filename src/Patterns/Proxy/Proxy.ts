/**
 * PROXY -
 * Proxy can be useful for example for validation
 * For example, let's consider we have a specific Module or Object Person
 * The Object is typed and used in the application by several services.
 * We want to improve the reliability of the data.
 * Proxy can help in validation data before sending it to the client.
 */

export const Person: {
  name: string;
  age: number;
  nationality: "American" | "French" | "Congolese" | "Chinese" | "Russian";
} = {
  name: "Cassius Marcellus Clay",
  age: 32,
  nationality: "American",
};

/**
 * The Proxy object allows you to create an object that can be used in place of the original object, but which may redefine fundamental Object operations like getting, setting, and defining properties.
 * Proxy objects are commonly used to log property accesses, validate, format, or sanitize inputs, and so on.
 *
 * You create a `Proxy` with two parameters:
 *  - `target`: Orginal object which you want to "proxy"
 *  - `handler`: Object that defines which operations will be intercepted and how to redefine intercepted operations
 * */
export const PersonProxy = new Proxy(Person, {
  get: (obj: any, prop: string) => {
    const message = obj[prop]
      ? `Value for [${prop}] is "${obj[prop]}"`
      : "Error: Unknown property";
    console.log(message);
    return obj[prop];
  },
  set: (obj: any, prop: string, value: any) => {
    if (prop === "name" && (value.length < 3 || value.length > 30))
      throw new Error("Only valid 'NAME' values are accepted");
    else if (prop === "age" && (typeof value !== "number" || value < 1))
      throw new Error("Only valid 'AGE' values are accepted");

    console.log(`Changed made for [${prop}] from "${obj[prop]}" to "${value}"`);

    obj[prop] = value;

    return true; // REQUIRED, Indicates successful assignment
  },
});
