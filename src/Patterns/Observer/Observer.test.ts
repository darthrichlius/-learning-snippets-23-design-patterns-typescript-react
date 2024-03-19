import { describe, expect, test } from "vitest";
import {
  GraphicsStore,
  clients,
  cards,
  GraphicCard,
  Jeanne,
} from "./mockFactory.ts";

const RTX3060 = new GraphicCard(cards.RTX3060, 3601);
const RTX3070 = new GraphicCard(cards.RTX3070, 3701);
const RTX4070 = new GraphicCard(cards.RTX4070, 4701);

const affordableCardsAreAvailable = (Card: GraphicCard) => {
  GraphicsStore.addProduct(Card);
};

describe("Provider Testing", () => {
  test("", () => {
    expect(
      GraphicsStore.observers.findIndex((client) => client === clients.Ghost)
    ).toBe(-1);

    // Testing Subscribe()
    GraphicsStore.subscribe(clients.Ghost);
    expect(
      GraphicsStore.observers.findIndex((client) => client === clients.Ghost)
    ).not.toBe(-1);

    // Testing Unsubscribe()
    GraphicsStore.unsubscribe(clients.Ghost);
    expect(
      GraphicsStore.observers.findIndex((client) => client === clients.Ghost)
    ).toBe(-1);
  });
});

describe("Scenarios Testing", () => {
  test("Initial mock assumption", () => {
    expect(GraphicsStore.products.length).toBe(20);
    expect(
      GraphicsStore.products.findIndex(
        (product) => product.type === cards.RTX3090
      )
    ).not.toBe(-1);
    /**
     * This is the most important part
     *
     * In our scenario, there is no RTX3060 and RTX3070 cards yet
     * Some Subscribers can't afford the RTX3080 and RTX3090
     * They are waiting for the availibitly of the most affordable RTX3060 and RTX3070 ones
     */
    expect(
      GraphicsStore.products.findIndex(
        (product) => product.type === cards.RTX3060
      )
    ).toBe(-1);
    /**
     * The two assertions below verify only subscribers will be notfied, not all the customers
     */
    expect(
      GraphicsStore.clients.findIndex((client) => client === clients.Ghost)
    ).not.toBe(-1);
    expect(
      GraphicsStore.observers.findIndex((client) => client === clients.Ghost)
    ).toBe(-1);
  });

  test("Subscribe Testing", () => {
    // At this stage none of our participants has a message
    expect(clients.Jeanne.messages.size).toBe(0);
    expect(clients.Marley.messages.size).toBe(0);
    expect(clients.Ghost.messages.size).toBe(0);

    // This should create a message for each participants, based on their interest
    /**
     * The only thing these functions do ...
     * ... is to add the product to the stock of our virtual Store
     */
    affordableCardsAreAvailable(RTX3060);
    affordableCardsAreAvailable(RTX3070);

    // Participant#1
    expect(clients.Jeanne.messages.size).toBe(1);
    expect(clients.Jeanne.messages.values().next().value).toContain(
      clients.Jeanne.interests.values().next().value
    );
    // Participant#2
    expect(clients.Marley.messages.size).toBe(1);
    expect(clients.Marley.messages.values().next().value).toContain(
      clients.Marley.interests.values().next().value
    );
    // Participant#3
    expect(clients.Ghost.messages.size).toBe(0);
  });

  test("Unubscribe Testing", () => {
    // At this stage our participants have 1 message each from the previous run
    expect(clients.Jeanne.messages.size).toBe(1);
    expect(clients.Marley.messages.size).toBe(1);
    expect(clients.Ghost.messages.size).toBe(0);

    // EVENT : Jeanne add interest for RTX3070, just like Marley
    clients.Jeanne.interests.add(cards.RTX3070);

    // EVENT
    affordableCardsAreAvailable(RTX3060);
    affordableCardsAreAvailable(RTX3070);

    // Participant#1 - Addtion as Jeanne now interested in RTX3070
    expect(clients.Jeanne.messages.size).toBe(2);
    // Participant#2 - Don't move as this is just like a Stock number change
    expect(clients.Marley.messages.size).toBe(1);
    // Participant#3
    expect(clients.Ghost.messages.size).toBe(0);

    // EVENT: Jeanne unsubscribe from the Store Newsletter
    GraphicsStore.unsubscribe(Jeanne);

    // EVENT: Jeanne & Marley add interest for the new RTX4070
    clients.Jeanne.interests.add(cards.RTX4070);
    clients.Marley.interests.add(cards.RTX4070);

    // EVENT: The new Graphic card is now available
    affordableCardsAreAvailable(RTX4070);

    // Participant#1 - Still 2 has Jeanne Unsubscribed
    expect(clients.Jeanne.messages.size).toBe(2);
    // Participant#2 - Now 2 as still subscribed
    expect(clients.Marley.messages.size).toBe(2);
    // Participant#3 - Still 0
    expect(clients.Ghost.messages.size).toBe(0);
  });
});
