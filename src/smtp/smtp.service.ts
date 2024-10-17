import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SmtpService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: `"Cinema Rental Studio" <${process.env.MAIL_EMAIL}>`,
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return {
        message: 'Email sent successfully!',
        info,
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendSelfMail(subject: string, text: string) {
    const mailOptions = {
      from: `"Cinema Rental Studio" <${process.env.MAIL_EMAIL}>`,
      to: process.env.MAIL_EMAIL,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return {
        message: 'Email sent successfully!',
        info,
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
