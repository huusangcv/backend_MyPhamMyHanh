import mongoose from 'mongoose';
require('dotenv').config();
const mongoUrl =
  process.env.MONGODB_CONNECT_URL ||
  'mongodb+srv://huusangcv:HN9j5TFizPCyNP6c@myphammyhanh.k4yz4.mongodb.net/?retryWrites=true&w=majority&appName=myphammyhanh';

console.log('This app listening on port:8080', mongoUrl);
const connect = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connect successfully');
  } catch (error) {
    console.error('Connect failure:', error);
  }
};

export { connect };
