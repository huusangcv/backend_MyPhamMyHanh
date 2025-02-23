import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/myphammyhanh');
    console.log('Connect successfully');
  } catch (error) {
    console.log('Connect failure');
  }
};

export { connect };
