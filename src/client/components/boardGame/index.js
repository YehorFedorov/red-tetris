import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { is }               from 'immutable';

import {
    isPossible,
    lineDestroyer,
    isPiece,
    rotate,
    pieceToBoard,
    updateSpectre,
    isGameLost
} from '../../helper';

import './style.scss';

export default class BoardGame extends Component {
    static propTypes = {
        posX            : PropTypes.number,
        posY            : PropTypes.number,
        board           : PropTypes.object,
        restartGame     : PropTypes.func,
        shape           : PropTypes.array,
        color           : PropTypes.string,
        looser          : PropTypes.bool,
        winner          : PropTypes.bool,
        isOver          : PropTypes.bool,
        isVisitor       : PropTypes.bool,
        gameId          : PropTypes.string,
        message         : PropTypes.string,
        nextPiece       : PropTypes.object,
        nextPieceColor  : PropTypes.string,
        startInterval   : PropTypes.func,
        activation      : PropTypes.func,
        moveLine        : PropTypes.func,
        hasToFall       : PropTypes.bool,
        disactivation   : PropTypes.func,
        loseGame        : PropTypes.func,
        playerId        : PropTypes.string,
        interval        : PropTypes.number,
        giveMalus       : PropTypes.func,
        clearMessage    : PropTypes.func,
        curPiece        : PropTypes.number,
        tetriRotate     : PropTypes.func,
        tetriMove       : PropTypes.func,
        nextTurn        : PropTypes.func,
        posePiece       : PropTypes.func,
        spectre         : PropTypes.array
    }

    componentDidMount() {
        const {
            startInterval,
            activation
        } = this.props;

        document.getElementById('inner').focus();
        startInterval(setInterval(() => activation(), 1000));
    }

    componentDidUpdate(nextProps) {
        const {
            interval,
            board,
            winner,
            looser,
            moveLine,
            hasToFall,
            disactivation,
            loseGame,
            playerId,
            gameId,
            giveMalus,
            clearMessage,
            message
        } = this.props;

        if (message && !is(message, nextProps.message)) {
            setTimeout(() => clearMessage(), 5000);
        }

        if (!is(looser, nextProps.looser) || !is(winner, nextProps.winner)) {
            clearInterval(interval);
        }

        if (!is(board, nextProps.board)) {
            if (isGameLost(board)) {
                loseGame({ playerId, gameId });
            }

            const lineToDestroy = lineDestroyer(board, giveMalus, playerId, gameId);

            if (lineToDestroy) {
                moveLine(lineToDestroy);
            }
        }

        if (hasToFall) {
            this.handleMoveDown();
            disactivation();
        }
    }

    componentWillUnmount() {
        const {
            interval
        } = this.props;

        clearInterval(interval);
    }

    handleBlur() {
        document.getElementById('inner').focus();
    }

    handleMoveRotate() {
        const {
            board,
            shape,
            posX,
            posY,
            curPiece,
            tetriRotate
        } = this.props;

        const newShape = rotate(shape);

        if (isPossible(board, newShape, posX, posY)) {
            tetriRotate({ shape: newShape, curPiece });
        }
    }

    handleMoveRight() {
        const {
            board,
            shape,
            posX,
            posY,
            curPiece,
            tetriMove
        } = this.props;

        if (isPossible(board, shape, posX + 1, posY)) {
            tetriMove({ posX: posX + 1, posY, curPiece });
        }
    }

    handleMoveLeft() {
        const {
            board,
            shape,
            posX,
            posY,
            curPiece,
            tetriMove
        } = this.props;

        if (isPossible(board, shape, posX - 1, posY)) {
            tetriMove({ posX: posX - 1, posY, curPiece });
        }
    }

    handleMoveForce() {
        const {
            board,
            shape,
            posX,
            posY,
            curPiece,
            tetriMove,
            nextTurn,
            posePiece,
            color,
            gameId,
            playerId,
            spectre
        } = this.props;

        let k = 1;
        let j = 0;

        if (posY >= 0) {
            while (j++ <= 19) {
                if (isPossible(board, shape, posX,  k + 1)) {
                    k++;
                }
            }

            tetriMove({ posX, posY: k, curPiece });
            const newBoard = pieceToBoard(board, shape, posX, k, color);

            posePiece(newBoard);
            nextTurn({
                gameId,
                playerId,
                spectre: updateSpectre(newBoard, spectre)
            });
        }
    }

    handleMoveDown() {
        const {
            board,
            shape,
            posX,
            posY,
            curPiece,
            tetriMove,
            nextTurn,
            posePiece,
            color,
            gameId,
            playerId,
            spectre
        } = this.props;

        if (isPossible(board, shape, posX, posY + 1)) {
            tetriMove({ posX, posY: posY + 1, curPiece });
        } else {
            const newBoard = pieceToBoard(board, shape, posX, posY, color);

            posePiece(newBoard);
            nextTurn({
                gameId,
                playerId,
                spectre: updateSpectre(newBoard, spectre)
            });
        }
    }

    onKey = (e) => {
        switch (e.keyCode) {
            case 32:
                this.handleMoveForce();
                break;
            case 37:
                this.handleMoveLeft();
                break;
            case 38:
                this.handleMoveRotate();
                break;
            case 39:
                this.handleMoveRight();
                break;
            case 40:
                this.handleMoveDown();
                break;
            default:
                break;
        }
    };

    render() {
        const {
            posX,
            posY,
            board,
            restartGame,
            shape,
            color,
            looser,
            winner,
            isOver,
            isVisitor,
            gameId,
            message,
            nextPiece,
            nextPieceColor
        } = this.props;

        return (
            <div className='game'>
                <div className='space'>
                    { nextPiece && (
                        <div className='board'>
                            {
                                nextPiece.map((line, j) => {
                                    return (
                                        <div key={j} className='line'>
                                            {
                                                line.map((bloc, i) => (
                                                    <div
                                                        key={`${i} ${j}`}
                                                        className={`sbloc ${bloc ? nextPieceColor : 'white'}`}
                                                    />)
                                                )
                                            }
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}
                </div>
                <div
                    className='board'
                    id='inner'
                    tabIndex='-1'
                    onBlur={this.handleBlur}
                    onKeyDown={isOver ? '' : this.onKey}
                >
                    {
                        board.map((line, j) => {
                            return (j === 0) ? ('') : (
                                <div key={j} className={`line ${(looser || winner) ? ' blur' : ''}`}>
                                    {
                                        line.map((bloc, i) => {
                                            if (isPiece(i, j, shape, posX, posY)) {
                                                return (<div key={`${i} ${j}`} className={`bloc ${color}`} />);
                                            }

                                            return (<div key={`${i} ${j}`} className={`bloc ${bloc.get('color')}`} />);
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                    {
                        (looser || winner) && (<h1 className='message'>{winner ? 'WINNER' : 'LOOSER'}</h1>)
                    }
                </div>
                <div className='space'>
                    { !isOver && message && (<p>{message}</p>) }
                    { isOver && !isVisitor && (
                        <button onClick={restartGame.bind(this, { gameId })} ><p>Play again</p></button>)
                    }
                </div>
            </div>
        );
    }
}
