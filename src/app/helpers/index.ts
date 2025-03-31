import crypto from 'crypto';
const nodemailer = require('nodemailer');

const SECRET = 'MYPHAMMYHANH-REST-API';

const random = () => crypto.randomBytes(128).toString('base64');
const authentication = (salt: string, password: string) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

const transporter = nodemailer.createTransport({
  service: 'gmail', // Bạn có thể sử dụng dịch vụ khác như Outlook, Yahoo nếu cần
  auth: {
    user: 'huusangcv@gmail.com', // Email của bạn
    pass: 'fdpq mgts ngdt wpwf', // Mật khẩu email hoặc App Password cho Gmail
  },
});

export { random, authentication, transporter };
