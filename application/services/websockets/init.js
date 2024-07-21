import { materialOrderWatcher } from './materialOrderWatcher.js';
import { materialWatcher } from './materialWatcher.js';

export default function(socket){
    console.log('Starting Sockets...');

    /* 
    The watchers below emit websocket events
    if there is ANY change in the database.
  */
    materialOrderWatcher(socket);
    materialWatcher(socket);
};