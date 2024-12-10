const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'config.env') });
const app = require('./app'); // The app should be required AFTER configuring the env variables

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
