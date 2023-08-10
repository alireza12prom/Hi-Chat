declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      SERVER_PORT: string;
    }
  }
}
export {};
