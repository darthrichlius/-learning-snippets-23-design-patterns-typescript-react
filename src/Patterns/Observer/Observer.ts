type TNotifyParam = (...arg: unknown[]) => string | undefined;
type TUpdateParam = string;

interface ISubscriber {
  update: (message: TUpdateParam) => void;
}

interface IObservable {
  observers: Array<ISubscriber>;
  subscribe: (s: ISubscriber) => void;
  unsubscribe: (s: ISubscriber) => void;
  notify: (fn: TNotifyParam) => number;
}

class Provider implements IObservable {
  observers: Array<ISubscriber> = [];

  constructor(observers: ISubscriber[]) {
    this.observers = observers;
  }
  subscribe(s: ISubscriber) {
    this.observers.push(s);
  }
  unsubscribe(s: ISubscriber) {
    this.observers = this.observers.filter((observer) => {
      return observer !== s;
    });
  }
  notify(messageFn: TNotifyParam) {
    let notfiedCount = 0;
    this.observers.forEach((subscriber) => {
      const message = messageFn(subscriber);
      if (message) {
        subscriber.update(message);
        ++notfiedCount;
      }
    });
    return notfiedCount;
  }
}

class Receiver implements ISubscriber {
  messages: Set<string> = new Set();
  update(message: TUpdateParam) {
    this.messages.add(message);
    // console.log(`${message}`);
  }
}

export { Provider, Receiver };
