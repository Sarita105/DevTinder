const mongoose = require('mongoose');

const connectDB = async () => {
  const url =
    'mongodb+srv://sarita_mandal:Bakesaabhi%401029@namastenode.qlebylv.mongodb.net/devTinder';
  await mongoose.connect(url);
};

module.exports = connectDB;

