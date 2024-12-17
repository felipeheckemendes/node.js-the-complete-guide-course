/* eslint-disable no-console */
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// mongoose.set('debug', true);

process.on('unhandledRejection', (err) => {
  console.log('\nGLOBAL UNHANDLED REJECTION:\n', err.name, '\n', err.message, '\n', err);
  console.log('Shutting down...');
  process.exit(1);
});

dotenv.config({ path: path.join(__dirname, 'config.env') });
const app = require('./app'); // The app should be required AFTER configuring the env variables, because requiring runs the file

// Connection to Mongoose
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('\nMongoDB Database Connection Succesfull');
  });

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}\n`);
});

process.on('uncaughtException', (err) => {
  console.log('\nGLOBAL UNHANDLED REJECTION:\n', err.name, '\n', err.message, '\n');
  console.log('Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
