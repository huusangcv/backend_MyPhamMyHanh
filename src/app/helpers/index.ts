import crypto from 'crypto';

const SECRET = 'MYPHAMMYHANH-REST-API';

const random = () => crypto.randomBytes(128).toString('base64');
const authentication = (salt: string, password: string) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

export { random, authentication };
