import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myphammyhanh');
        console.log("Connect successfully")
    } catch (error) {
        console.log('Connect failure')
    }
}

export { connect }