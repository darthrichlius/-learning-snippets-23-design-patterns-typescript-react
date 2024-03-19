import { IClient, IEvent, IMediator } from "./Mediator";

let idMessage = 0;
const ACTION_SEND_MESSAGE = "ACTION_SEND_MESSAGE";

const ROLE_MONITOR = "ROLE_MONITOR";
const ROLE_USER = "ROLE_USER";
type TUserRole = typeof ROLE_MONITOR | typeof ROLE_USER;
export const userRoles: {
  [key: string]: TUserRole;
} = { ROLE_MONITOR, ROLE_USER };

export class User implements IClient {
  private messages: Message[] = [];
  private mediator: IMediator | undefined;
  public username: string;
  public role: typeof ROLE_MONITOR | typeof ROLE_USER = ROLE_USER;

  constructor(username: string) {
    // We don't ask mediator in the constructor to avoid code coupling
    // The goal is always to design with the less coupling as possible
    this.username = username;
  }
  setMediator(mediator: IMediator) {
    this.mediator = mediator;
  }
  hasMediator(): boolean {
    return !!this.mediator;
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }
  getMessages() {
    return this.messages;
  }

  setRole(role: TUserRole) {
    this.role = role;
  }
}

export class Message implements IEvent {
  id: number;
  time: number;
  action: string;
  payload: unknown;
  constructor(receiver: IClient, message: string) {
    this.payload = {
      receipt: receiver,
      message: message,
    };
    this.action = ACTION_SEND_MESSAGE;
    this.time = new Date().getTime();
    this.id = ++idMessage;
  }
}

export class Chatroom implements IMediator {
  private users: User[] = [];
  private logs: Message[] = [];

  subscribe(user: User) {
    user.setMediator(this);
    this.users.push(user);
  }

  notify(sender: IClient, event: IEvent) {
    let error: string = "";
    const hasUsers = this.users.length;
    const senderIndex = this.users.findIndex(
      (user) => user.username === sender.username
    );
    const receiptIndex = this.users.findIndex(
      (user) => user.username === event.payload.receipt.username
    );

    /**
     * STEP: INITIAL VALIDATION
     */
    if (!hasUsers) error = "The current Chat has no user";
    else if (senderIndex === -1) error = "You have not subsribed to this chat";
    else if (receiptIndex === -1)
      error = "The receipt has not subscribed to the chat";
    if (error) throw new Error(error);

    /**
     * STEP: PROCESSING MESSAGES
     */
    // We send the message
    this.users[receiptIndex].addMessage(event);

    // We send the message to users who has "Monitor" role
    this.users.forEach((user) => {
      if (user.username !== sender.username && user.role === ROLE_MONITOR) {
        user.addMessage(event);
      }
    });

    // Finally, each message is logged
    this.logs.push(event);
  }

  getLogs() {
    return this.logs;
  }
}
