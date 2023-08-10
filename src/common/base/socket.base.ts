import socket from 'socket.io';

export abstract class BaseSocketGateway {
  constructor(protected io: socket.Namespace) {}
  public abstract init(): void;
}
