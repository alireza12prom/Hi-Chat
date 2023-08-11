import { BaseVerifyEmailService } from '../common/base';

export class VerifyEmailService extends BaseVerifyEmailService {
  async send(to: { name: string; email: string }, code: string | number) {
    const email = this.mailgen.generate({
      body: {
        name: to.name,
        intro: `verification code: ${code}`,
      },
    });

    await this.transport.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: to.email,
      subject: 'Verify Your Email',
      html: email,
    });
  }
}

// --- injecting dependensies
import { mailGenerator, transporter } from '../common/base';
export const verifyEmailService = new VerifyEmailService(transporter, mailGenerator);
