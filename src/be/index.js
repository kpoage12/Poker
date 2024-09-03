import express from 'express';
import http, { get } from 'http';
import { Server } from 'socket.io';
import Game from '../logic/Game.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

// active games in memory
const games = new Map();

function getGame(gameId) {
    let game = games.get(gameId);
    if (!game) {
        throw new Error('No game with that id');
    }
    return game;
}

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { error } from 'console';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const staticname = join(__dirname, '../static')
console.log(`fn= ${__filename}, dn= ${__dirname} sn= ${staticname}`)

app.use(express.static(staticname));

app.get('/api/game/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    // Assuming getState can now accept a gameId to fetch specific game state
    try{
        let guy = getGame(gameId);
        res.json(guy.getState());
    }catch(error){
        res.json({error: 'No game with that id'});
    }   
  });
  app.post('/api/login', (req, res) => {
    // get name from request body
    res.cookie('playerId', req.body.playerName, { httpOnly: true, maxAge: 900000 });
  });
  app.post('/api/game/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    
    try{
        let guy = getGame(gameId);
        res.json({error: 'this game already exists'});
    }catch(error){
        let game = new Game(gameId);
        games.set(gameId, game);
        res.json({success: 'Game created'});
    }   
  });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('registerPlayer', (gameId, playerName) => {
    let g = games.get(gameId)
    console.log(`Registering player: ${playerName}`); // Debugging log
    if (g.players.some(p => p.name === playerName)) {
        socket.emit('registrationError', 'Player name already taken');
    } else {
        g.addPlayer(playerName, socket.id);
        console.log(`Player ${playerName} registered successfully`); // Debugging log
        io.emit('gameState', g.getGameState()); // Broadcast updated game state to all clients
        socket.emit('registrationSuccess', g.getPlayerState(playerName));
    }
});

socket.on('playerAction', (actionData) => {
    const {gameId, playerName, action, amount } = actionData;
    let g = games.get(gameId)
    const player = g.getPlayerByName(playerName);

    if (!player) {
        socket.emit('actionError', 'Invalid action or player');
        return;
    }

    try {
        if (action === 'check') {
            console.log("check!");

            g.check(player);
        } else if (action === 'call') {
            g.call(player);
        } else if (action === 'raise') {
            g.raise(player, amount);
        } else if (action === 'fold') {
            g.fold(player);
        }

        io.emit('gameState', g.getGameState());
    } catch (error) {
        socket.emit('actionError', error.message);
    }
});

  socket.on('startGame', (gameId) => {
    console.log('Starting game...');
    let g = games.get(gameId)
    g.startNewRound(); // Start the game or a new round
    io.emit('gameState', g.getGameState()); // Broadcast updated game state to all clients
  });

  socket.on('disconnect', (gameId) => {
      let g = games.get(gameId)       
      g.removePlayerBySocketId(socket.id);
      io.emit('gameState', g.getPublicGameState());
      console.log('User disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});