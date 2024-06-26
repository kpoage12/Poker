document.addEventListener('DOMContentLoaded', () => {
  const gameTableBody = document.querySelector('#game-table tbody');
  const potSizeElement = document.getElementById('pot-size');
  const cards = document.getElementById('board-size');

  const socket = io();

  const userName = ""

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');

    // get the player's name from a textBox [jon]
    // or from the URL ?player=jon
    // or from a cookie (only from a previously saved value)
    // set userName = textBox.value
  });

  socket.on('gameState', (gameState) => {
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

      // if it's my turn, gameState.playerTurn === userName
      // show the action buttons BET (AMOUNT) FOLD

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
