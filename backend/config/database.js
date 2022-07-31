var mongoose = require("mongoose");
const mongoUsername = process.env.DB_USER;
const mongoPassword = encodeURIComponent(process.env.DB_PASS);
const mongoHost = process.env.DB_HOST;
const mongoPort = process.env.DB_PORT;
const mongoDatabase = process.env.DB_NAME;

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

var uri = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
//var uri = `mongodb://localhost:27017/glofans`;

console.log('uri : ', uri);
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Succesfully Connected to the Mongodb Database  at URL :', uri)
  })
  .catch(e => {
    console.log(e);
  });