const {materialOrderWatcher} = require('./materialOrderWatcher')
const {materialWatcher} = require('./materialWatcher');

module.exports = function(socket){
  console.log('Starting Sockets...');

  /* 
    The watchers below emit websocket events
    if there is ANY change in the database.
  */
  materialOrderWatcher(socket)
  materialWatcher(socket)
}