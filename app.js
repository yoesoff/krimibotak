const express = require('express')
const app = express()

var firebase = require('firebase');

app.get('/', (req, res) => res.send('Hello World Happy Express day!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
