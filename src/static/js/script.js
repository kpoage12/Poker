
document.addEventListener('DOMContentLoaded', () => {
  const gameTableBody = document.querySelector('#game-table tbody');
  const boardSizeElement = document.querySelector('#board-size')
  const potSizeElement = document.getElementById('pot-size');
  const currentPlayerElement = document.getElementById('current-player');
  const bettingRoundElement = document.getElementById('betting-round');
  const addPlayerButton = document.getElementById('add-player-button');
  const playerNameInput = document.getElementById('player-name');
  const startGameButton = document.getElementById('start-game-button');
  const playerActions = document.getElementById('player-actions');
  const checkButton = document.getElementById('check-button');
  const callButton = document.getElementById('call-button');
  const raiseButton = document.getElementById('raise-button');
  const raiseAmountInput = document.getElementById('raise-amount');
  const foldButton = document.getElementById('fold-button');

  const socket = io();
  let currentPlayerName = '';
  let currentBet = 0;

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('gameState', (gameState) => {
    currentPlayerName = gameState.currentPlayer;
    currentBet = gameState.currentBet;
    console.log('Game state received:', gameState);
    gameTableBody.innerHTML = '';
    gameState.players.forEach(player => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const handCell = document.createElement('td');
      const betCell = document.createElement('td');

      nameCell.textContent = player.name;
      handCell.textContent = player.hand.map(card => `${card.unicode}`).join(' ');
      handCell.classList.add('hand');

      betCell.textContent = `$${player.bet}`;

      row.appendChild(nameCell);
      row.appendChild(handCell);
      row.appendChild(betCell);
      gameTableBody.appendChild(row);

      if (gameState.currentPlayer) {
        playerActions.style.display = 'block';
      } else {
        playerActions.style.display = 'none';
      }
  
    });
    boardSizeElement.textContent = gameState.communityCards.map(card => `${card.unicode}`).join(' ');
    potSizeElement.textContent = `Pot: $${gameState.pot}`;
    currentPlayerElement.textContent = `Current Player: ${gameState.currentPlayer}`;
    bettingRoundElement.textContent = `Betting Round: ${gameState.bettingRound}`;

  
  });

  addPlayerButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      socket.emit('command', `addPlayer ${playerName}`);
      playerNameInput.value = '';
    } else {
      alert('Please enter a player name');
    }
  });

  if (startGameButton){
    startGameButton.addEventListener('click', () => {
      socket.emit('command', 'start');
    });
  }

  checkButton.addEventListener('click', () => {
    socket.emit('command', `check ${currentPlayerName}`);
  });

  callButton.addEventListener('click', () => {
    socket.emit('command', `call ${currentPlayerName}`);
  });

  raiseButton.addEventListener('click', () => {
    const raiseAmount = parseInt(raiseAmountInput.value, 10);
    if (!isNaN(raiseAmount) && raiseAmount >= 2*currentBet) {
      socket.emit('command', `raise ${currentPlayerName} ${raiseAmount}`);
      raiseAmountInput.value = '';
    } else {
      alert('Please enter a valid raise amount');
    }
  });

  foldButton.addEventListener('click', () => {
    socket.emit('command', `fold ${currentPlayerName}`);
  })



});
