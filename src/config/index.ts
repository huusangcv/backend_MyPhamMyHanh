import mongoose from 'mongoose';
const mongoUrl =
  process.env.MONGODB_CONNECT_URL ||
  'mongodb+srv://huusangcv:HN9j5TFizPCyNP6c@myphammyhanh.k4yz4.mongodb.net/?retryWrites=true&w=majority&appName=myphammyhanh';

const connect = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000, // Thay đổi thời gian timeout nếu cần
      socketTimeoutMS: 45000, // Thay đổi timeout cho socket
    });
    console.log('Connect successfully');
  } catch (error) {
    console.error('Connect failure:', error);
  }
};

export { connect };
