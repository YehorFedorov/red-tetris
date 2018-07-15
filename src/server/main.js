import 'babel-core/register';
import 'babel-polyfill';

import http 		from 'http';
import cors 		from 'cors';
import express 		from 'express';
import mongoose 	from 'mongoose';
import bodyParser 	from 'body-parser';
import socketServer from 'socket.io';

import config 	from '../../params';
import event 	from './event/index.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.io = new socketServer(server);

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.dbName}`);

const db = mongoose.connection;

db.on('error', err => {
    console.log('FAILED TO CONNECT', err);
    process.exit(1);
});

app.get('/', (req, res) => res.end());

global.io.on('connection', (socket) => {
    event(socket);
});

db.once('open', () => {
    app.emit('ready');
});


server.listen(5000, () => {
    console.log('listening on 5000');
});
