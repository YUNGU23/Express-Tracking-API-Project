const https = require('https');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/universal_tracker.js');

const app = express();
const port = 3000;
dotenv.config();

const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}

const server = https.createServer(httpsOptions,app);

app.use(express.json());
app.use('/', router);

server.listen(port, () => {
    console.log('HTTPS is running on port ' + port + '')
});
