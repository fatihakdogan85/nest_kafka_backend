import nodemailer from 'nodemailer';
import { EmailRequest } from '../model/email.request';

export class EmailSender {
  sendMail(emailRequest: EmailRequest): boolean {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ourmail@gmail.com',
        pass: 'ourpassword',
      },
    });

    const mailOptions = {
      from: 'ourmail@gmail.com',
      to: emailRequest.emailAddress,
      subject: emailRequest.subject,
      text: emailRequest.content,
    };

    return transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
        return false;
      } else {
        return true;
      }
    });
  }
}
