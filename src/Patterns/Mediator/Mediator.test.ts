import { describe, test, expect } from "vitest";
import { Chatroom, User, Message, userRoles } from "./mockFactory";

const ArrayMessageLast = (arr: Message[]) => {
  return arr[arr.length - 1];
};

describe("Scenario 1", () => {
  /**
   * By Defaukt each User has a "USER" role
   */
  const Bob = new User("Bob");
  /**
   * Bob is the only user that has "MONITOR" role
   * By design, Users with the "ROLE_MONITOR" receive all the messages sent by users
   */
  Bob.setRole(userRoles.ROLE_MONITOR);
  const Marley = new User("Marley");
  const Jeanne = new User("Jeanne");
  const Ghost = new User("Ghost");

  // We create a chat
  const CompanyChat = new Chatroom();

  /**
   * Each user subscribes to the Chat
   * Subscribing doesn't mean receiving messages
   * Each message has it owns single receipt
   */
  CompanyChat.subscribe(Bob);
  CompanyChat.subscribe(Marley);
  CompanyChat.subscribe(Jeanne);
  CompanyChat.subscribe(Ghost);

  test("Case 1: User A and B exchange messages", () => {
    /**
     * STEP1: Building the messages
     */
    const JeanneText =
      "Hello Marley, Good news, I've just finnished the report. Do you want to read it before I send it?";
    const JeanneToMarley = new Message(Marley, JeanneText);
    const MarleyText =
      "Hello Jeanne, Fantastic! Yes, of course. Please send it to mail inbox";
    const MarleyToJeanne = new Message(Jeanne, MarleyText);

    /**
     * STEP2: Sending the messages
     */
    // Jeanne starts the conversation and send a message to Marley through the Chat
    CompanyChat.notify(Jeanne, JeanneToMarley);
    // Marley responds to Jeanne
    CompanyChat.notify(Marley, MarleyToJeanne);

    /**
     * STEP3: Assertions
     */
    // Marley should had received the message
    expect(Marley.getMessages().length).toBe(1);
    expect(ArrayMessageLast(Marley.getMessages()).payload!.message).toBe(
      JeanneText
    );
    // Jeanne should had received the message
    expect(Jeanne.getMessages().length).toBe(1);
    expect(ArrayMessageLast(Jeanne.getMessages()).payload!.message).toBe(
      MarleyText
    );
  });

  test("Case 2: All messages are logged in the ChatLog", () => {
    expect(CompanyChat.getLogs().length).toBe(2);

    /**
     * STEP1: Send message
     */
    const JeanneText =
      "Marley, Roger, I have just sent it to you. Happy reading :)";
    const JeanneToMarley = new Message(Marley, JeanneText);
    CompanyChat.notify(Jeanne, JeanneToMarley);

    // Jeanne has 1 Message has Marley responded to her first message
    expect(Jeanne.getMessages().length).toBe(1);
    // Marley has 2 Messages, the first one (case 1) and the one of case 2
    expect(Marley.getMessages().length).toBe(2);

    // The logs should contains 3 Messages
    expect(CompanyChat.getLogs().length).toBe(3);
  });

  test("Case 2: Only user with ROLE_MONITOR received all the exchanges messages", () => {
    expect(Bob.getMessages().length).toBe(3);
    expect(Ghost.getMessages().length).toBe(0);
  });
});
