document.addEventListener('DOMContentLoaded', () => {
  const gameTableBody = document.querySelector('#game-table tbody');
  const potSizeElement = document.getElementById('pot-size');
  const cards = document.getElementById('board-size');

  const socket = io();

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('newGameState', (gameState) => {
    // when anything changes, redraw the game
    console.log('Game state received:', gameState);
    
    // clear the area gameTableBody
    gameTableBody.innerHTML = '';

    // a row for each player
    gameState.players.forEach(player => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const handCell = document.createElement('td');
      const betCell = document.createElement('td');

      nameCell.textContent = player.name;
      handCell.textContent = player.hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
      betCell.textContent = `$${player.bet}`;

      row.appendChild(nameCell);
      row.appendChild(handCell);
      row.appendChild(betCell);
      gameTableBody.appendChild(row);
    });
    
    // draw shared cards
    cards.textContent = gameState.communityCards.map(card => `${card.rank} of ${card.suit}`).join(', ');
    // draw the pot
    potSizeElement.textContent = gameState.pot;
  });
});
