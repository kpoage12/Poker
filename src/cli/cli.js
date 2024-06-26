import io from 'socket.io-client';
import readline from 'readline';

const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

socket.on('connect', () => {
  console.log('Connected to the server');

  rl.on('line', (input) => {
    console.log(`Sending command: ${input}`);
    socket.emit('command', input);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.on('gameState', (gameState) => {
  console.log('Game State Updated:', gameState);
});
