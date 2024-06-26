// server.js
const express = require('express');
const app = express();
const port = 3000;

// only one global game for now
import Game from '../logic/Game.js';

const game = new Game(); // Create a new game instance
game.start(); // Start the game

// Serve static files from the public directory
app.use(express.static('static'));

// Define the /api/game route
// TODO add a parameter to get a specific game
app.get('/api/game', (req, res) => {
  res.json(game.getState()); // Respond with the current game state as JSON
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
