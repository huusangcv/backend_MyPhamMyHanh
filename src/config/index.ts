import mongoose from 'mongoose';
const connect = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://huusangcv:HN9j5TFizPCyNP6c@myphammyhanh.k4yz4.mongodb.net/?retryWrites=true&w=majority&appName=myphammyhanh',
    );
    console.log('Connect successfully');
  } catch (error) {
    console.log('Connect failure');
  }
};

export { connect };
