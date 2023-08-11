import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

export abstract class BaseVerifyEmailService {
  constructor(
    protected transport: nodemailer.Transporter,
    protected mailgen: Mailgen,
  ) {}

  abstract send(to: { name: string; email: string }, code: string): Promise<void>;
}
