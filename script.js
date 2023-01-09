/* eslint-disable no-use-before-define */
const manipulateDom = (() => {
  const toggleDisplayOn = (domSelector) => {
    const selector = document.querySelector(domSelector);
    selector.style.display = 'flex';
  };
  const toggleDisplayOff = (domSelector) => {
    const selector = document.querySelector(domSelector);
    selector.style.display = 'none';
  };

  const activateFirstSceneButtons = () => {
    const pVP = document.querySelector('.PvP');
    pVP.addEventListener('click', manipulateDom.callSecondScenePvP);

    const pVC = document.querySelector('.PvC');
    pVC.addEventListener('click', manipulateDom.callSecondScenePvC);
  };

  const activateSecondSceneButtons = () => {
    const startGame = document.querySelector('.scene-select-name button');
    startGame.addEventListener('click', player.submitVal);
  };

  const activateThirdSceneButtons = () => {
    const restartGame = document.querySelector('.scene-during-game .restart-game');
    restartGame.addEventListener('click', gamePlay.restartGame);

    const changePlayers = document.querySelector('.scene-during-game .change-players');
    changePlayers.addEventListener('click', gamePlay.newGame);

    const squares = document.querySelectorAll('.squares');
    for (let i = 0; i < squares.length; i += 1) {
      squares[i].addEventListener('click', (e) => {
        const indexNumber = e.target.id;
        if (e.target.innerHTML === '') {
          e.target.innerHTML = `${gamePlay.getCurrentMove()}`;
          gamePlay.cacheMoves(indexNumber);
          gamePlay.checkWin();
        }
      });
    }
  };

  const activateFourthSceneButtons = () => {
    const restartGame = document.querySelector('.scene-end-round .restart-game');
    restartGame.addEventListener('click', gamePlay.restartGame);

    const newRound = document.querySelector('.new-round');
    newRound.addEventListener('click', gamePlay.startRound);

    const changePlayers = document.querySelector('.scene-end-round .change-players');
    changePlayers.addEventListener('click', gamePlay.newGame);
  };

  const callFirstScene = () => {
    toggleDisplayOff('.winner');
    toggleDisplayOff('.scene-end-round');
    toggleDisplayOff('.scene-during-game');
    toggleDisplayOff('.scene-select-name');
    toggleDisplayOn('.scene-choose-play');
    activateFirstSceneButtons();
  };

  const callSecondScenePvP = () => {
    toggleDisplayOff('.winner');
    toggleDisplayOff('.scene-end-round');
    toggleDisplayOff('.scene-during-game');
    toggleDisplayOff('.scene-choose-play');
    toggleDisplayOn('.scene-select-name');
    toggleDisplayOn('.player2-form');
    activateSecondSceneButtons();
  };

  const callSecondScenePvC = () => {
    toggleDisplayOff('.winner');
    toggleDisplayOff('.scene-end-round');
    toggleDisplayOff('.scene-during-game');
    toggleDisplayOff('.scene-choose-play');
    toggleDisplayOff('.player2-form');
    toggleDisplayOn('.scene-select-name');
    activateSecondSceneButtons();
  };

  const callThirdScene = () => {
    toggleDisplayOff('.winner');
    toggleDisplayOff('.scene-end-round');
    toggleDisplayOff('.scene-choose-play');
    toggleDisplayOff('.scene-select-name');
    toggleDisplayOn('.scene-during-game');
    activateThirdSceneButtons();
  };

  const callFourthScene = () => {
    toggleDisplayOff('.scene-choose-play');
    toggleDisplayOff('.scene-select-name');
    toggleDisplayOff('.scene-during-game');
    toggleDisplayOn('.scene-end-round');
    toggleDisplayOn('.winner');
    activateFourthSceneButtons();
  };

  const turnGameBoardSceneOn = () => {
    const selector = document.querySelector('.game-board-container');
    selector.style.display = 'grid';
  };

  const turnGameBoardSceneOff = () => {
    toggleDisplayOff('.game-board-container');
  };

  return {
    callFirstScene,
    callSecondScenePvP,
    callSecondScenePvC,
    callThirdScene,
    callFourthScene,
    turnGameBoardSceneOn,
    turnGameBoardSceneOff,
    activateFirstSceneButtons,
  };
})();

manipulateDom.activateFirstSceneButtons();

const player = (() => {
  const player1 = {};
  const player2 = {};

  let player1Marker = '';
  let player2Marker = '';

  let validation = false;
  const validate = () => {
    player1Marker = document.querySelector('input[name="player1Marker"]:checked').value;
    player2Marker = document.querySelector('input[name="player2Marker"]:checked').value;

    if (player1Marker === player2Marker) {
      // eslint-disable-next-line no-alert
      alert('Players Must Choose Different Markers');
      validation = false;
    } else {
      validation = true;
    }

    return {
      player1Marker,
      player2Marker,
      validation,
    };
  };
  const submitVal = () => {
    validate();
    if (validation) {
      player1.name = document.querySelector('#player1-name').value;
      player1.marker = player1Marker;
      player2.name = document.querySelector('#player2-name').value;
      player2.marker = player2Marker;
      manipulateDom.turnGameBoardSceneOn();
      manipulateDom.callThirdScene();
      showNames();
      gamePlay.showScore();
      gamePlay.startRound();
    }
  };

  const getNamePlayer1 = () => player1.name;
  const getNamePlayer2 = () => player2.name;
  const getMarkerPlayer1 = () => player1.marker;
  const getMarkerPlayer2 = () => player2.marker;

  const showNames = () => {
    const player1NameShow = document.querySelector('.player1-name-container');
    player1NameShow.innerHTML = '';
    player1NameShow.innerHTML = `<span>${player1.name}</span>`;

    const player2NameShow = document.querySelector('.player2-name-container');
    player2NameShow.innerHTML = '';
    player2NameShow.innerHTML = `<span>${player2.name}</span>`;

    const player1NameShowEndRound = document.querySelector('.scene-end-round .player1-name-container');
    player1NameShowEndRound.innerHTML = '';
    player1NameShowEndRound.innerHTML = `<span>${player1.name}</span>`;

    const player2NameShowEndRound = document.querySelector('.scene-end-round .player2-name-container');
    player2NameShowEndRound.innerHTML = '';
    player2NameShowEndRound.innerHTML = `<span>${player2.name}</span>`;
  };

  return {
    submitVal,
    getNamePlayer1,
    getNamePlayer2,
    getMarkerPlayer1,
    getMarkerPlayer2,

  };
})();

const gamePlay = (() => {
  let lastMove = '';
  let currentMove = '';

  const newGame = () => {
    restartGame();
    manipulateDom.callFirstScene();
    manipulateDom.turnGameBoardSceneOff();
  };

  const restartGame = () => {
    startRound();
    emptyGameCache();
    showScore();
  };

  const startRound = () => {
    const squares = document.querySelectorAll('.squares');
    for (let i = 0; i < squares.length; i += 1) {
      squares[i].innerHTML = '';
    }

    emptyRoundCache();
    manipulateDom.callThirdScene();
  };

  const defineCurrentMove = () => {
    if (lastMove === '' || lastMove === 'O') {
      currentMove = 'X';
    } if (lastMove === 'X') {
      currentMove = 'O';
    }
  };

  const getCurrentMove = () => {
    defineCurrentMove();
    lastMove = currentMove;
    return currentMove;
  };

  const movesX = [];
  const movesO = [];

  const cacheMoves = (indexNumber) => {
    if (currentMove === 'X') {
      movesX.push(indexNumber);
    } else if (currentMove === 'O') {
      movesO.push(indexNumber);
    }
  };

  let winningPattern = null;
  let scorePlayer1 = 0;
  let scorePlayer2 = 0;

  const checkWin = () => {
    let moves = [];
    if (currentMove === 'X') {
      moves = movesX;
    } else if (currentMove === 'O') {
      moves = movesO;
    }

    if (moves.length >= 3) {
      if (moves.includes('1') && moves.includes('2') && moves.includes('3')) {
        winningPattern = '1';
      } else if (moves.includes('4') && moves.includes('5') && moves.includes('6')) {
        winningPattern = '2';
      } else if (moves.includes('7') && moves.includes('8') && moves.includes('9')) {
        winningPattern = '3';
      } else if (moves.includes('1') && moves.includes('4') && moves.includes('7')) {
        winningPattern = '4';
      } else if (moves.includes('2') && moves.includes('5') && moves.includes('8')) {
        winningPattern = '5';
      } else if (moves.includes('3') && moves.includes('6') && moves.includes('9')) {
        winningPattern = '6';
      } else if (moves.includes('1') && moves.includes('5') && moves.includes('9')) {
        winningPattern = '7';
      } else if (moves.includes('3') && moves.includes('5') && moves.includes('7')) {
        winningPattern = '8';
      } else {
        winningPattern = null;
        if (moves.length === 5) {
          const winnerMessage = 'It\'s a tie';
          const winnerMessageShow = document.querySelector('.winner');
          winnerMessageShow.innerHTML = winnerMessage;
          showScore();
          manipulateDom.callFourthScene();
        }
      }
    }

    if (moves.length >= 3 && winningPattern !== null) {
      if (player.getMarkerPlayer1() === currentMove) {
        const winnerMessage = `${player.getNamePlayer1()} wins!`;
        const winnerMessageShow = document.querySelector('.winner');
        winnerMessageShow.innerHTML = winnerMessage;
        scorePlayer1 += 1;
        showScore();
      } else {
        const winnerMessage = `${player.getNamePlayer2()} wins!`;
        const winnerMessageShow = document.querySelector('.winner');
        winnerMessageShow.innerHTML = winnerMessage;
        scorePlayer2 += 1;
        showScore();
      }
      manipulateDom.callFourthScene();
      showWinPattern();
    }
  };

  const showWinPattern = () => {
    const gameBoard = document.querySelector('.game-board-container');
    const canvas = document.createElement('canvas');
    gameBoard.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    switch (winningPattern) {
      case '1':
        ctx.moveTo(0, 2);
        ctx.lineTo(300, 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '2':
        ctx.moveTo(0, 75);
        ctx.lineTo(300, 75);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '3':
        ctx.moveTo(0, 147);
        ctx.lineTo(300, 147);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '4':
        ctx.moveTo(3, 0);
        ctx.lineTo(3, 300);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '5':
        ctx.moveTo(148, 0);
        ctx.lineTo(148, 300);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '6':
        ctx.moveTo(297, 0);
        ctx.lineTo(297, 300);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '7':
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 150);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      case '8':
        ctx.moveTo(300, 0);
        ctx.lineTo(0, 150);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0B0C10';
        ctx.stroke();

        break;
      default:
    }
  };

  const removeCanvas = () => {
    const div = document.querySelector('.game-board-container');
    const lastElement = div.lastElementChild.tagName;
    if (lastElement === 'CANVAS') {
      const gameBoard = document.querySelector('.game-board-container');
      const canvas = document.querySelector('canvas');
      gameBoard.removeChild(canvas);
    }
  };

  const showScore = () => {
    const player1ScoreShow = document.querySelectorAll('.player1-score-container');
    for (let i = 0; i < player1ScoreShow.length; i += 1) {
      player1ScoreShow[i].innerHTML = '';
      player1ScoreShow[i].innerHTML = `<span>${scorePlayer1}</span>`;
    }

    const player2ScoreShow = document.querySelectorAll('.player2-score-container');
    for (let i = 0; i < player1ScoreShow.length; i += 1) {
      player2ScoreShow[i].innerHTML = '';
      player2ScoreShow[i].innerHTML = `<span>${scorePlayer2}</span>`;
    }
  };

  const emptyRoundCache = () => {
    movesX.length = 0;
    movesO.length = 0;
    lastMove = 'O';
    winningPattern = null;
    removeCanvas();
  };

  const emptyGameCache = () => {
    scorePlayer1 = 0;
    scorePlayer2 = 0;
  };

  return {
    getCurrentMove,
    cacheMoves,
    startRound,
    checkWin,
    restartGame,
    showScore,
    newGame,
  };
})();
