import { connect }  from 'react-redux';

import tetriMove      from './../actions/tetriMove';
import tetriRotate    from './../actions/tetriRotate';
import nextTurn       from './../actions/nextTurn';
import moveLine       from './../actions/moveLine';
import disactivation  from './../actions/disactivation';
import activation     from './../actions/activation';
import posePiece      from './../actions/posePiece';
import restartGame    from './../actions/restartGame';
import loseGame       from './../actions/loseGame';
import giveMalus      from './../actions/giveMalus';
import clearMessage   from './../actions/clearMessage';
import startInterval  from './../actions/startInterval';

import BoardGame      from './../components/boardGame';

function mapStateToProps(state) {
    const players = state.game.getIn(['room', 'players']);
    const pieces = state.game.getIn(['room', 'pieces']);
    const gameId = state.game.getIn(['room', 'id']);

    const isOver = state.game.getIn(['room', 'isOver']);

    const currentPlayerIndex = players.findIndex(player => player.get('name') === state.game.getIn(['info', 'name']));
    const currentPlayer = players.find(player => player.get('name') === state.game.getIn(['info', 'name']));
    const isVisitor = currentPlayer.get('isVisitor');
    const looser = currentPlayer.get('looser');
    const winner = currentPlayer.get('winner');

    const curPiece = currentPlayer.get('curPiece');
    const nextPiece = pieces.getIn([curPiece + 1, 'shape']);
    const nextPieceColor = pieces.getIn([curPiece + 1, 'color']);
    const playerId = currentPlayer.get('_id');
    const spectre = currentPlayer.get('spectre').toJS();
    const currentPiece = state.game.getIn([ 'currentPiece' ]);

    const posX = currentPiece.get('positionX');
    const posY = currentPiece.get('positionY');
    const color = currentPiece.get('color');
    const shape = currentPiece.get('shape').toJS();

    const board = state.game.getIn([ 'board' ]);
    const hasToFall = state.game.get('hasToFall') || false;
    const interval = state.game.get('interval') || 15;
    const message = state.game.get('message') || '';

    return {
        isOver,
        looser,
        winner,
        isVisitor,
        currentPlayerIndex,
        currentPlayer,
        curPiece,
        board,
        posX,
        posY,
        nextPiece,
        playerId,
        gameId,
        spectre,
        currentPiece,
        color,
        shape,
        hasToFall,
        interval,
        players,
        message,
        nextPieceColor
    };
}

function mapDispatchToProps(dispatch) {
    return {
        tetriMove: (data) => dispatch(tetriMove(data)),
        tetriRotate: (data) => dispatch(tetriRotate(data)),
        nextTurn: (data) => dispatch(nextTurn(data)),
        moveLine: (data) => dispatch(moveLine(data)),
        posePiece: (data) => dispatch(posePiece(data)),
        activation: () => dispatch(activation()),
        disactivation: () => dispatch(disactivation()),
        startInterval: (data) => dispatch(startInterval(data)),
        restartGame: (data) => dispatch(restartGame(data)),
        loseGame: (data) => dispatch(loseGame(data)),
        giveMalus: (data) => dispatch(giveMalus(data)),
        clearMessage: () => dispatch(clearMessage())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoardGame);
