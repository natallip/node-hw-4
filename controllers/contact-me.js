const nodemailer = require('nodemailer');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const config = require('../config.json');

module.exports = async (ctx, next) => {
  // console.log(333, ctx.request.body);
  const { name, email, message } = await ctx.request.body;
  if (!name || !email || !message) {
    ctx.body = { msgSendMail: 'Заполните все поля!', status: 'Error' };
  } else {
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: `Message from: ${name} <${email}>\n ${message}`
    };
    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        ctx.body = ({ msgSendMail: `При отправке письма произошла ошибка!: ${error}`, status: 'Error' });
        return false;
      }
      if (!db.get('emails').value()) {
        db.defaults({ emails: [] }).write();
      }
      db.get('emails')
        .push({ email, name, message })
        .write();
    });
    ctx.body = ({ msgSendMail: 'Сообщение отправлено!', status: 'OK' });
  }
};
