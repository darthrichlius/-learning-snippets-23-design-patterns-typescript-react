export interface IEvent {
  id: number;
  time: number;
  action: string;
  payload: unknown;
}

export interface IMediator {
  notify: (sender: IClient, event: IEvent) => void;
}

export interface IClient {
  setMediator: (mediator: IMediator) => void;
}
