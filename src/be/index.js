import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from '../logic/Game.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://kpoage12.github.io/Poker/',
        methods: ['GET', 'POST']
    }
});
app.use(cors());

const port =  process.env.PORT || 3000;

// only one game at a time
const game = new Game();

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const staticname = join(__dirname, '../docs')
console.log(`fn= ${__filename}, dn= ${__dirname} sn= ${staticname}`)

// const myLogger = function (req, res, next) {
//   next()
// }
// app.use(myLogger)

app.use(express.static(staticname));
//  app.use(express.static(__dirname + '/public'));

// this should be parameterized for multiple games
app.get('/api/game', (req, res) => {
  res.json(game.getState());
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('registerPlayer', (playerName) => {
    console.log(`Registering player: ${playerName}`); // Debugging log
    if (game.players.some(p => p.name === playerName)) {
        socket.emit('registrationError', 'Player name already taken');
    } else {
        game.addPlayer(playerName, socket.id);
        console.log(`Player ${playerName} registered successfully`); // Debugging log
        io.emit('gameState', game.getGameState()); // Broadcast updated game state to all clients
        socket.emit('registrationSuccess', game.getPlayerState(playerName));
    }
});

socket.on('playerAction', (actionData) => {
    console.log("here");
    const { playerName, action, amount } = actionData;
    const player = game.getPlayerByName(playerName);

    if (!player) {
        socket.emit('actionError', 'Invalid action or player');
        return;
    }

    try {
        if (action === 'check') {
            console.log("check!");

            game.check(player);
        } else if (action === 'call') {
            game.call(player);
        } else if (action === 'raise') {
            game.raise(player, amount);
        } else if (action === 'fold') {
            game.fold(player);
        }

        io.emit('gameState', game.getGameState());
    } catch (error) {
        socket.emit('actionError', error.message);
    }
});

  socket.on('startGame', () => {
    console.log('Starting game...');
    game.startNewRound(); // Start the game or a new round
    io.emit('gameState', game.getGameState()); // Broadcast updated game state to all clients
  });

  socket.on('disconnect', () => {
      game.removePlayerBySocketId(socket.id);
      io.emit('gameState', game.getPublicGameState());
      console.log('User disconnected:', socket.id);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
