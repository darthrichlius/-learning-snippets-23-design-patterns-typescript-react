import { Provider, Receiver } from "./Observer";

export class GraphicCard {
  type;
  serialNumber;
  constructor(type: string, serialNumber: number) {
    this.type = type;
    this.serialNumber = serialNumber;
  }
}

class Store extends Provider {
  clients: Client[] = [];
  products: GraphicCard[] = [];
  constructor(clients: Client[]) {
    const _subs =
      clients && Array.isArray(clients)
        ? clients.filter((client) => client.interests && client.interests.size)
        : [];
    super(_subs);
    this.clients = clients;
  }

  messageFn = (client: Client): string | undefined => {
    const products: GraphicCard[] = this.products;
    const availibitly: Array<string> = [];
    if (products && client.interests) {
      client.interests.forEach((interest) => {
        const match = products.find((product) => product.type == interest);
        if (match) availibitly.push(match.type);
      });

      if (availibitly.length) {
        return `Your insterests for ${[...availibitly].join(
          ","
        )} has been granted`;
      }

      return;
    }
  };

  addProduct(product: GraphicCard) {
    this.products.push(product);
    this.notify(this.messageFn);
  }

  removeProduct(serialNumber: number) {
    this.products = this.products.filter(
      (product) => product.serialNumber !== serialNumber
    );
  }
}

class Client extends Receiver {
  name: string;
  interests: Set<string>;

  constructor(name: string, interests: Set<string>) {
    super();
    this.name = name;
    this.interests = interests;
  }
}

// ################# RUN ################### //

const RTX4070 = "RTX4070";
const RTX3090 = "RTX3090";
const RTX3080 = "RTX3080";
const RTX3070 = "RTX3070";
const RTX3060 = "RTX3060";
export const cards = { RTX3060, RTX3070, RTX3080, RTX3090, RTX4070 };

/**
 * Using Set is just about making sure modifications are easier
 * We answer the Client expectations is unique regarding Cards
 */
export const Bob = new Client("Bob", new Set<string>().add(RTX3090));
export const Marley = new Client("Marley", new Set<string>().add(RTX3070));
export const Jeanne = new Client("Jeanne", new Set<string>().add(RTX3060));
export const Ghost = new Client("Ghost", new Set());
export const clients = { Bob, Marley, Jeanne, Ghost };

let gcRTX3080 = 3800;
let gcRTX3090 = 3900;
const count = 20;
const stock: GraphicCard[] = [];
Array.from(Array(count).keys()).forEach((v, i) => {
  if (i <= 10) {
    stock.push(new GraphicCard(RTX3080, ++gcRTX3080));
  } else {
    stock.push(new GraphicCard(RTX3090, ++gcRTX3090));
  }
});

const GraphicsStore = new Store([Bob, Marley, Jeanne, Ghost]);

GraphicsStore.products = stock;

export { GraphicsStore, stock };
