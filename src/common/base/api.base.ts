export abstract class BaseHttpGateway {
  constructor(protected app: Express.Application, protected baseUrl: string) {}
  public abstract init(): void;
}
