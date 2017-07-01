import low from 'lowdb';
import storage from 'lowdb/lib/storages/file-async';
// import { app } from 'electron';

const electron = require('electron')
let remote = require('electron').remote
const app = remote.app




const db = low(app.getPath('userData') + '/db.json', {
    storage
});

db.defaults({ address: [], callTimes: [], friends: [] })
  .write();


export default db;
