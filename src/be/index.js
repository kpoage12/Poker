import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from '../logic/Game.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

// only one game at a time
const game = new Game();

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticname = join(__dirname, '../static')
console.log(`fn= ${__filename}, dn= ${__dirname} sn= ${staticname}`)

const myLogger = function (req, res, next) {
  console.log("logging")
  console.log(req.baseUrl)
  next()
}
app.use(myLogger)

app.use(express.static(staticname));
//  app.use(express.static(__dirname + '/public'));

// this should be parameterized for multiple games
app.get('/api/game', (req, res) => {
  res.json(game.getState());
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('gameState', game.getGameState());

  socket.on('command', (cmd) => {
    console.log('Command received:', cmd);
    const [action, ...params] = cmd.split(' ');

    if (action === 'addPlayer') {
      const playerName = params.join(' ');
      game.addPlayer(playerName);
    } else if (action === 'start') {
      game.startNewRound();
    } else if (action === 'dealFlop') {
      game.dealFlop();
    } else if (action === 'dealTurn') {
      game.dealTurn();
    } else if (action === 'dealRiver') {
      game.dealRiver();
    } else if (action === 'bet') {
      const playerName = params[0];
      const amount = parseInt(params[1], 10);
      const player = game.players.find(p => p.name === playerName);
      if (player) {
        game.placeBet(player, amount);
      }
    } else if (action === 'fold') {
      const playerName = params[0];
      const player = game.players.find(p => p.name === playerName);
      if (player) {
        player.fold();
      }
    }
    io.emit('gameState', game.getGameState());
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
