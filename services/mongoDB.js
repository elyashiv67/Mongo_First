import mongoose from 'mongoose';

const connectDB = () => {
    mongoose.connect(process.env.DB);
    const db = mongoose.connection;

    db.on('error', (err) => {
        console.log(err);
    });

    db.once('connected' , () => {
        console.log('MongoDB Connected and listening on port ' + process.env.PORT);
    });
}

export default connectDB;