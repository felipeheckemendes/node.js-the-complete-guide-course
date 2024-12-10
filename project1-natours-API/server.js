app = require('./app.js');

// START SERVER
port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
