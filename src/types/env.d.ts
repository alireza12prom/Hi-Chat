declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      SERVER_PORT: string;
      NODEMAILER_USER: string;
      NODEMAILER_PASS: string;
      NODEMAILER_EMAIL: string;
      JWT_SECRET: string;
      VERIFY_MESSAGE_EXPIRE_SEC: string;
      ACCESS_TOKEN_EXPIRE_DAY: string;
      SESSION_EXPIRE_DAY: string;
      MAX_ACTIVE_SESSION: string;
    }
  }
}
export {};
