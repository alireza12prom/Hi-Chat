declare namespace Express {
  interface Request {
    user: { id: string };
    validatedInput: any;
  }
}
