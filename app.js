const express = require('express')
const app = express()

var firebase = require('firebase');

app.get('/', (req, res) => res.send('Hello World Happy Express day!'))

const server = app.listen(process.env.PORT || 8081, () => {
  const port = server.address().port;
  console.log(`Example app listening on port ${port}!`)
});
