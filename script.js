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
          plAIr.comPlaysHard();
        }
      });
    }
  };

  const activateFourthSceneButtons = () => {
    const newRound = document.querySelector('.new-round');
    newRound.addEventListener('click', gamePlay.startRound);

    const changeMarker = document.querySelector('.change-marker');
    changeMarker.addEventListener('click', gamePlay.startRoundWithDifferentMarker);

    const restartGame = document.querySelector('.scene-end-round .restart-game');
    restartGame.addEventListener('click', gamePlay.restartGame);

    const changePlayers = document.querySelector('.scene-end-round .change-players');
    changePlayers.addEventListener('click', gamePlay.newGame);
  };

  let gameMode = '';
  const getGameMode = () => gameMode;

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
    gameMode = 'PvP';
  };

  const callSecondScenePvC = () => {
    toggleDisplayOff('.winner');
    toggleDisplayOff('.scene-end-round');
    toggleDisplayOff('.scene-during-game');
    toggleDisplayOff('.scene-choose-play');
    toggleDisplayOff('.player2-form');
    toggleDisplayOn('.scene-select-name');
    activateSecondSceneButtons();
    gameMode = 'PvC';
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
    getGameMode,
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
      if (manipulateDom.getGameMode() === 'PvP') {
      // eslint-disable-next-line no-alert
        alert('Players Must Choose Different Markers');
        validation = false;
      } else {
        validation = true;
      }
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
      if (manipulateDom.getGameMode() === 'PvP') {
        player2.name = document.querySelector('#player2-name').value;
        player2.marker = player2Marker;
      } else if (manipulateDom.getGameMode() === 'PvC') {
        player2.name = 'PL-AI-R';
        player2.marker = plAIr.computerMarker();
      }

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
    const player1NameShow = document.querySelector('.scene-during-game .player1-name-container');
    player1NameShow.innerHTML = '';
    player1NameShow.innerHTML = `<span>${player1.name} - ${player1.marker}</span>`;

    const player2NameShow = document.querySelector('.scene-during-game .player2-name-container');
    player2NameShow.innerHTML = '';
    player2NameShow.innerHTML = `<span>${player2.name} - ${player2.marker}</span>`;

    const player1NameShowEndRound = document.querySelector('.scene-end-round .player1-name-container');
    player1NameShowEndRound.innerHTML = '';
    player1NameShowEndRound.innerHTML = `<span>${player1.name} - ${player1.marker}</span>`;

    const player2NameShowEndRound = document.querySelector('.scene-end-round .player2-name-container');
    player2NameShowEndRound.innerHTML = '';
    player2NameShowEndRound.innerHTML = `<span>${player2.name} - ${player2.marker}</span>`;
  };

  const changeMarker = () => {
    const player1MarkerCache = player1.marker;
    player1.marker = player2.marker;
    player2.marker = player1MarkerCache;
  };

  return {
    submitVal,
    getNamePlayer1,
    getNamePlayer2,
    getMarkerPlayer1,
    getMarkerPlayer2,
    changeMarker,
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

    if (manipulateDom.getGameMode() === 'PvC' && player.getMarkerPlayer1() !== 'X') {
      plAIr.comPlaysHard();
    }
  };

  const startRoundWithDifferentMarker = () => {
    startRound();
    player.changeMarker();
  };

  const defineCurrentMove = () => {
    if (lastMove === '' || lastMove === 'O') {
      currentMove = 'X';
    } if (lastMove === 'X') {
      currentMove = 'O';
    }
  };

  const getCurrentMove = () => {
    if (manipulateDom.getGameMode() === 'PvP') {
      defineCurrentMove();
      lastMove = currentMove;
      return currentMove;
    } if (manipulateDom.getGameMode() === 'PvC') {
      currentMove = player.getMarkerPlayer1();
      lastMove = currentMove;
      return currentMove;
    }
    return 'error';
  };

  const movesX = [];
  const getMovesX = () => movesX;
  const movesO = [];
  const getMovesO = () => movesO;

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

  const getWinningPattern = () => winningPattern;

  const checkWin = (x = currentMove) => {
    let moves = [];
    if (x === 'X') {
      moves = movesX;
    } else if (x === 'O') {
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
      if (player.getMarkerPlayer1() === x) {
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
    getMovesX,
    getMovesO,
    startRound,
    checkWin,
    getWinningPattern,
    restartGame,
    showScore,
    newGame,
    startRoundWithDifferentMarker,
  };
})();

const plAIr = (() => {
  const computerMarker = () => {
    if (player.getMarkerPlayer1() === 'X') {
      return 'O';
    } if (player.getMarkerPlayer1() === 'O') {
      return 'X';
    }
    return 'error';
  };

  const allPossibleMoves = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const movesX = gamePlay.getMovesX();
  const movesO = gamePlay.getMovesO();

  const getMovesMade = () => {
    const allMovesMade = movesX.concat(movesO);
    return allMovesMade;
  };

  const getMovesRemained = () => {
    const allMovesMade1 = new Set(getMovesMade());
    const remainedMoves = allPossibleMoves.filter((x) => !allMovesMade1.has(x));
    return remainedMoves;
  };

  const pickRandom = (array) => array[Math.floor(Math.random() * array.length)];

  const checkPossibleWin = (moves) => {
    let winningMove = '';
    if (moves.length >= 2) {
      if (moves.includes('1') && moves.includes('2') && getMovesRemained().includes('3')) { // possible win pattern1
        winningMove = '3';
      } else if (moves.includes('1') && moves.includes('3') && getMovesRemained().includes('2')) {
        winningMove = '2';
      } else if (moves.includes('2') && moves.includes('3') && getMovesRemained().includes('1')) {
        winningMove = '1';
      } else if (moves.includes('4') && moves.includes('5') && getMovesRemained().includes('6')) { // possible win pattern2
        winningMove = '6';
      } else if (moves.includes('4') && moves.includes('6') && getMovesRemained().includes('5')) {
        winningMove = '5';
      } else if (moves.includes('5') && moves.includes('6') && getMovesRemained().includes('4')) {
        winningMove = '4';
      } else if (moves.includes('8') && moves.includes('9') && getMovesRemained().includes('7')) { // possible win pattern3
        winningMove = '7';
      } else if (moves.includes('7') && moves.includes('9') && getMovesRemained().includes('8')) {
        winningMove = '8';
      } else if (moves.includes('7') && moves.includes('8') && getMovesRemained().includes('9')) {
        winningMove = '9';
      } else if (moves.includes('1') && moves.includes('4') && getMovesRemained().includes('7')) { // possible win pattern3
        winningMove = '7';
      } else if (moves.includes('1') && moves.includes('7') && getMovesRemained().includes('4')) {
        winningMove = '4';
      } else if (moves.includes('4') && moves.includes('7') && getMovesRemained().includes('1')) {
        winningMove = '1';
      } else if (moves.includes('2') && moves.includes('5') && getMovesRemained().includes('8')) { // possible win pattern5
        winningMove = '8';
      } else if (moves.includes('2') && moves.includes('8') && getMovesRemained().includes('5')) {
        winningMove = '5';
      } else if (moves.includes('5') && moves.includes('8') && getMovesRemained().includes('2')) {
        winningMove = '2';
      } else if (moves.includes('3') && moves.includes('6') && getMovesRemained().includes('9')) { // possible win pattern6
        winningMove = '9';
      } else if (moves.includes('3') && moves.includes('9') && getMovesRemained().includes('6')) {
        winningMove = '6';
      } else if (moves.includes('6') && moves.includes('9') && getMovesRemained().includes('3')) {
        winningMove = '3';
      } else if (moves.includes('1') && moves.includes('5') && getMovesRemained().includes('9')) { // possible win pattern7
        winningMove = '9';
      } else if (moves.includes('1') && moves.includes('9') && getMovesRemained().includes('5')) {
        winningMove = '5';
      } else if (moves.includes('5') && moves.includes('9') && getMovesRemained().includes('1')) {
        winningMove = '1';
      } else if (moves.includes('3') && moves.includes('5') && getMovesRemained().includes('7')) { // possible win pattern8
        winningMove = '7';
      } else if (moves.includes('3') && moves.includes('7') && getMovesRemained().includes('5')) {
        winningMove = '5';
      } else if (moves.includes('5') && moves.includes('7') && getMovesRemained().includes('3')) {
        winningMove = '3';
      }
    }
    return winningMove;
  };

  const makeMove = (id) => {
    const squares = document.getElementById(id);
    squares.innerHTML = `${computerMarker()}`;
    if (computerMarker() === 'X') {
      movesX.push(id);
    } else if (computerMarker() === 'O') {
      movesO.push(id);
    }
  };

  const playCode = [];
  const comPlaysHard = () => {
    if (manipulateDom.getGameMode() === 'PvC') {
      const corners = ['1', '3', '7', '9'];
      if (computerMarker() === 'X') {
      // First three marks begining of one of two strategies.
      // Rest of the marks will be placed to win or to block and if there is no possibility for two,
      // As the last option they will be placed randomly.
      // First Move

        if (movesO.length === 0) {
          const firstMove = pickRandom(corners);
          makeMove(firstMove);
        }
        if (movesO.length === 1) {
        // Second Move
          if (movesO[0] === '5') {
          // Play Name Rush the Corners
            playCode.push('111');
            const remainedCorners = corners.filter((x) => x !== movesX[0]);
            const secondMove = pickRandom(remainedCorners);
            makeMove(secondMove);
          } else {
            const randomWayChoose = pickRandom(['1', '2']);
            if (randomWayChoose === '1') {
            // Play Name Rush the Corners
              const remainedCorners = corners.filter((x) => x !== movesX[0] && x !== movesO[0]);
              const secondMove = pickRandom(remainedCorners);
              makeMove(secondMove);
              playCode.push('111');
            } else {
            // Play Name Stay Compact
              let secondMove = '';
              if (movesX[0] === '1' && movesO[0] !== '2' && movesO[0] !== '4') {
                secondMove = pickRandom(['2', '4']);
              } else if ((movesX[0] === '1' && movesO[0] === '2') || (movesX[0] === '7' && movesO[0] === '8')) {
                secondMove = '4';
              } else if ((movesX[0] === '1' && movesO[0] === '4') || (movesX[0] === '3' && movesO[0] === '6')) {
                secondMove = '2';
              } else if (movesX[0] === '3' && movesO[0] !== '2' && movesO[0] !== '6') {
                secondMove = pickRandom(['2', '6']);
              } else if ((movesX[0] === '3' && movesO[0] === '2') || (movesX[0] === '9' && movesO[0] === '8')) {
                secondMove = '6';
              } else if (movesX[0] === '7' && movesO[0] !== '4' && movesO[0] !== '8') {
                secondMove = pickRandom(['4', '8']);
              } else if ((movesX[0] === '7' && movesO[0] === '4') || (movesX[0] === '9' && movesO[0] === '6')) {
                secondMove = '8';
              } else if (movesX[0] === '9' && movesO[0] !== '6' && movesO[0] !== '8') {
                secondMove = pickRandom(['6', '8']);
              }
              makeMove(secondMove);
              playCode.push('112');
            }
          }
        }

        if (movesO.length === 2) {
          // third move check win and block moves if both empty, then make move suits strategy.
          // if no suitable move, then mark randomly.
          const xWinningMove = checkPossibleWin(movesX);
          const oBlockingMove = checkPossibleWin(movesO);
          if (xWinningMove !== '' && !getMovesMade().includes(xWinningMove)) {
            makeMove(xWinningMove);
            gamePlay.checkWin(computerMarker());
          } else if (oBlockingMove !== '' && !getMovesMade().includes(oBlockingMove)) {
            makeMove(oBlockingMove);
          } else if (gamePlay.getWinningPattern() === null) {
            if (playCode[playCode.length - 1] === '111') {
              // eslint-disable-next-line max-len
              const remainedCorners = corners.filter((x) => !movesX.includes(x) && !movesO.includes(x));
              makeMove(pickRandom(remainedCorners));
            } else if (playCode[playCode.length - 1] === '112' && !movesO.includes('5')) {
              makeMove('5');
            } else {
              makeMove(pickRandom(getMovesRemained()));
            }
          }
        }
        if (movesO.length >= 3) {
          playCode.length = 0;
          // rest of the moves for check win and block options
          const xWinningMove = checkPossibleWin(movesX);
          const oBlockingMove = checkPossibleWin(movesO);
          if (xWinningMove !== '' && !getMovesMade().includes(xWinningMove)) {
            makeMove(xWinningMove);
          } else if (oBlockingMove !== '' && !getMovesMade().includes(oBlockingMove)) {
            makeMove(oBlockingMove);
          } else if (gamePlay.getWinningPattern() === null) {
            makeMove(pickRandom(getMovesRemained()));
          }
          gamePlay.checkWin(computerMarker());
        }
      }
      if (computerMarker() === 'O') {
        if (movesX.length === 1) {
          // first Move
          if (corners.includes(movesX[0])) {
            const firstMove = '5';
            makeMove(firstMove);
          } else {
            const firstMove = pickRandom(corners);
            makeMove(firstMove);
          }
        } else if (movesX.length === 2) { // second Move
          if (movesO[0] === '5') {
            const xBlockingMove = checkPossibleWin(movesX);
            if (xBlockingMove !== '' && getMovesRemained().includes(xBlockingMove)) {
              makeMove(xBlockingMove);
            } else if (getMovesRemained().includes('2') && getMovesRemained().includes('8')) {
              const secondMove = pickRandom(['2', '8']);
              makeMove(secondMove);
            } else if (getMovesRemained().includes('1') && getMovesRemained().includes('9')) {
              const secondMove = pickRandom(['1', '9']);
              makeMove(secondMove);
            } else if (getMovesRemained().includes('4') && getMovesRemained().includes('6')) {
              const secondMove = pickRandom(['4', '6']);
              makeMove(secondMove);
            } else if (getMovesRemained().includes('3') && getMovesRemained().includes('7')) {
              const secondMove = pickRandom(['3', '7']);
              makeMove(secondMove);
            }
          } else if (movesO[0] !== '5') {
            const xBlockingMove = checkPossibleWin(movesX);
            if (xBlockingMove !== '' && getMovesRemained().includes(xBlockingMove)) {
              makeMove(xBlockingMove);
            } else if (movesO[0] === '1' && (movesX.includes('2') || movesX.includes('3')) && (movesX.includes('4') || movesX.includes('7'))) {
              const secondMove = '5';
              makeMove(secondMove);
            } else if (movesO[0] === '1' && (!movesX.includes('2') && !movesX.includes('3')) && (!movesX.includes('4') && !movesX.includes('7'))) {
              const secondMove = pickRandom(['3', '7']);
              makeMove(secondMove);
            } else if (movesO[0] === '1' && (!movesX.includes('2') && !movesX.includes('3'))) {
              const secondMove = '3';
              makeMove(secondMove);
            } else if (movesO[0] === '1' && (!movesX.includes('4') && !movesX.includes('7'))) {
              const secondMove = '7';
              makeMove(secondMove);
            } else if (movesO[0] === '3' && (movesX.includes('1') || movesX.includes('2')) && (movesX.includes('6') || movesX.includes('9'))) {
              const secondMove = '5';
              makeMove(secondMove);
            } else if (movesO[0] === '3' && (!movesX.includes('1') && !movesX.includes('2')) && (!movesX.includes('6') && !movesX.includes('9'))) {
              const secondMove = pickRandom(['1', '9']);
              makeMove(secondMove);
            } else if (movesO[0] === '3' && (!movesX.includes('1') && !movesX.includes('2'))) {
              const secondMove = '1';
              makeMove(secondMove);
            } else if (movesO[0] === '3' && (!movesX.includes('6') && !movesX.includes('9'))) {
              const secondMove = '9';
              makeMove(secondMove);
            } else if (movesO[0] === '7' && (movesX.includes('1') || movesX.includes('4')) && (movesX.includes('8') || movesX.includes('9'))) {
              const secondMove = '5';
              makeMove(secondMove);
            } else if (movesO[0] === '7' && (!movesX.includes('1') && !movesX.includes('4')) && (movesX.includes('8') && movesX.includes('9'))) {
              const secondMove = pickRandom(['1', '9']);
              makeMove(secondMove);
            } else if (movesO[0] === '7' && (!movesX.includes('1') && !movesX.includes('4'))) {
              const secondMove = '1';
              makeMove(secondMove);
            } else if (movesO[0] === '7' && (!movesX.includes('8') && !movesX.includes('9'))) {
              const secondMove = '9';
              makeMove(secondMove);
            } else if (movesO[0] === '9' && (movesX.includes('3') || movesX.includes('6')) && (movesX.includes('7') || movesX.includes('8'))) {
              const secondMove = '5';
              makeMove(secondMove);
            } else if (movesO[0] === '9' && (!movesX.includes('3') && !movesX.includes('6')) && (!movesX.includes('7') && !movesX.includes('8'))) {
              const secondMove = pickRandom(['3', '7']);
              makeMove(secondMove);
            } else if (movesO[0] === '9' && (!movesX.includes('3') && !movesX.includes('6'))) {
              const secondMove = '3';
              makeMove(secondMove);
            } else if (movesO[0] === '9' && (!movesX.includes('7') && !movesX.includes('8'))) {
              const secondMove = '7';
              makeMove(secondMove);
            }
          }
          gamePlay.checkWin(computerMarker());
        } else if (movesX.length >= 3 && movesX.length < 5) { // third Move
          const oWinningMove = checkPossibleWin(movesO);
          console.log(movesO);
          console.log(checkPossibleWin(movesO));
          const xBlockingMove = checkPossibleWin(movesX);
          console.log(movesX);
          console.log(checkPossibleWin(movesX));
          if (oWinningMove !== '' && getMovesRemained().includes(oWinningMove)) {
            makeMove(oWinningMove);
          } else if (xBlockingMove !== '' && getMovesRemained().includes(xBlockingMove)) {
            makeMove(xBlockingMove);
          } else {
            makeMove(pickRandom(getMovesRemained()));
          }
          gamePlay.checkWin(computerMarker());
        }
      }
    }
  };

  return {
    computerMarker,
    comPlaysHard,
  };
})();
