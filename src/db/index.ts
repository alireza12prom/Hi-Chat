import mongoose from 'mongoose';

const connection = mongoose.connect(process.env.MONGO_URL);

connection
  .then((ins) => {
    console.log('mongodb has connected successfully');
  })
  .catch(() => {
    console.log('mongodb could not connect');
  });
