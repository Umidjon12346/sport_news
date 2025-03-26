const nodemailer = require("nodemailer");
const config = require("config");



class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendActivationMail(toEmail, link) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "lugatim akkaunti faollasg",
      text: "",
      html: `
        <div><h1>Akkatumni folasaa uchun linkni bossssss</h1>
        <a href=${link}>Faollashrit uchun </a>
        </div>
        `,
    });
  }

    async sendOtpMail(toEmail, otp) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Tasdiqlash kodi (OTP)",
      html: `
        <div>
          <h1>Sizning tasdiqlash kodingiz (OTP):</h1>
          <h2 style="color: blue;">${otp}</h2>
          <p>Bu kod 5 daqiqa davomida amal qiladi.</p>
        </div>
      `,
    });
  }
}



module.exports = new MailService();
