document.addEventListener('DOMContentLoaded', () => {
  const gameTableBody = document.querySelector('#game-table tbody');
  const potSizeElement = document.getElementById('pot-size');
  const cards = document.getElementById('board-size');

  const socket = io();

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('gameState', (gameState) => {
    console.log('Game state received:', gameState);
    gameTableBody.innerHTML = '';
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
    
    cards.textContent = gameState.communityCards.map(card => `${card.rank} of ${card.suit}`).join(', ');
    potSizeElement.textContent = gameState.pot;
  });
});
