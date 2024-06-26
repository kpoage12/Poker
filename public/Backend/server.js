// server.js
const express = require('express');
const app = express();
const port = 3000;

const Game = require('./src/Game'); // Import the Game class

const game = new Game(); // Create a new game instance
game.start(); // Start the game

// Serve static files from the public directory
app.use(express.static('public'));

// Define the /api/game route
app.get('/api/game', (req, res) => {
  res.json(game.getState()); // Respond with the current game state as JSON
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
