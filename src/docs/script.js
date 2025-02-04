document.addEventListener('DOMContentLoaded', () => {
  const socket = io("https://poker-mw4z.onrender.com");

  const nameEntryScreen = document.getElementById('name-entry-screen');
  const gameScreen = document.getElementById('game-screen');
  const playerNameInput = document.getElementById('player-name-input');
  const joinGameButton = document.getElementById('join-game-button');
  const startGameButton = document.getElementById('start-game-button');
  const gameTableBody = document.querySelector('#game-table tbody');
  const communityCardsDiv = document.getElementById('community-cards');
  const potSizeSpan = document.getElementById('pot-size');
  const currentPlayerSpan = document.getElementById('current-player');
  const checkButton = document.getElementById('check-button');
  const callButton = document.getElementById('call-button');
  const raiseButton = document.getElementById('raise-button');
  const foldButton = document.getElementById('fold-button');


  let playerName = '';
  let currentPlayer = '';

  joinGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        console.log('Emitting registerPlayer event for', playerName); // Debugging log
        socket.emit('registerPlayer', playerName);
    } else {
        alert('Please enter a valid name');
    }
});

startGameButton.addEventListener('click', () => {
  socket.emit('startGame');
});

socket.on('registrationSuccess', (playerState) => {
    console.log('Registration successful:', playerState); // Debugging log
    nameEntryScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    updatePlayerState(playerState);
});

socket.on('registrationError', (errorMessage) => {
    alert(errorMessage);
});

  socket.on('gameState', (gameState) => {
      updateGameState(gameState);
      console.log(gameState);
  });

  socket.on('yourState', (playerState) => {
      updatePlayerState(playerState);
  });

  function updatePlayerState(playerState) {
      const playerRow = document.createElement('tr');
      const nameCell = document.createElement('td');
      const handCell = document.createElement('td');
      const betCell = document.createElement('td');
      const chipsCell = document.createElement('td');

      nameCell.textContent = playerState.name;
      handCell.innerHTML = playerState.hand.map(card => `${card.rank} of ${card.suit}`).join(', ');
      betCell.textContent = `$${playerState.bet}`;
      chipsCell.textContent = `$${playerState.chips}`;

      playerRow.appendChild(nameCell);
      playerRow.appendChild(handCell);
      playerRow.appendChild(betCell);
      playerRow.appendChild(chipsCell);

      gameTableBody.appendChild(playerRow);
  }

  function updateGameState(gameState) {
    gameTableBody.innerHTML = '';
    gameState.players.forEach(player => {
        const playerRow = document.createElement('tr');
        const nameCell = document.createElement('td');
        const handCell = document.createElement('td');
        handCell.classList.add('hand');
        const betCell = document.createElement('td');
        const chipsCell = document.createElement('td');

        nameCell.textContent = player.name;


        if (!currentPlayer || player.name === playerName) {
            handCell.textContent = player.hand.map(card => `${card.unicode}`).join(' ');
        } 
        else {
            handCell.textContent = '🂠 🂠';
        }

        betCell.textContent = `$${player.bet}`;
        chipsCell.textContent = `$${player.chips}`;

        playerRow.appendChild(nameCell);
        playerRow.appendChild(handCell);
        playerRow.appendChild(betCell);
        playerRow.appendChild(chipsCell);

        gameTableBody.appendChild(playerRow);
        /**if (gameState.currentPlayer === playerName) {
            enableButtons();
        } else {
            disableButtons();
        }    */
    });

    

    communityCardsDiv.innerHTML = gameState.communityCards.map(card => `<span>${card.unicode}`).join(' ');
    potSizeSpan.textContent = gameState.pot;
    currentPlayer = gameState.currentPlayer
    currentPlayerSpan.textContent = currentPlayer;
      

  }

/** 
  function enableButtons() {
    checkButton.disabled = false;
    callButton.disabled = false;
    raiseButton.disabled = false;
    foldButton.disabled = false;
}

function disableButtons() {
    checkButton.disabled = true;
    callButton.disabled = true;
    raiseButton.disabled = true;
    foldButton.disabled = true;
}
*/

checkButton.addEventListener('click', () => {
    console.log(`Check button clicked by ${playerName}`); // Debugging log
    if (playerName === currentPlayer){
        socket.emit('playerAction', { playerName, action: 'check' });
    }
});

  callButton.addEventListener('click', () => {
      socket.emit('playerAction', { playerName, action: 'call' });
  });

  raiseButton.addEventListener('click', () => {
      const raiseAmount = parseInt(document.getElementById('raise-amount').value, 10);
      socket.emit('playerAction', { playerName, action: 'raise', amount: raiseAmount });
  });

  foldButton.addEventListener('click', () => {
      socket.emit('playerAction', { playerName, action: 'fold' });
  });
});
