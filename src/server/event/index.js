import filter   from 'lodash/filter';
import find     from 'lodash/find';

import Game   from '../controllers/Game.controller.js';
import Player from '../controllers/Player.controller.js';
import Piece  from '../controllers/Piece.controller.js';

export default (socket) => {
    socket.on('disconnect', (data) => disconnected(data, socket));

    socket.on('newPlayer', (data) => newPlayer(data, socket));

    socket.on('startGame', (data) => startGame(data, socket));

    socket.on('nextTurn', (data) => nextTurn(data, socket));

    socket.on('restartGame', (data) => restartGame(data, socket));

    socket.on('giveMalus', (data) => giveMalus(data, socket));

    socket.on('loseGame', (data) => loseGame(data, socket));

    socket.on('getGames', (data) => getGames(data, socket));
};

async function getGames(data, socket) {
    try {
        const allGame = await Game.getGames();

        socket.emit('action', {
            type: 'GET_GAMES',
            data: allGame
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function loseGame(data, socket) {
    try {
        let isOver = false;

        await Player.updatePlayerById({ looser: true }, data.playerId);

        const game = await Game.getGameById(data.gameId);

        const standingPlayers = filter(game.players, player => !player.looser);

        if ((standingPlayers.length === 1 && game.players.length !== 1) || standingPlayers.length === 0) {
            if (standingPlayers.length === 1) {
                Player.updatePlayerById({ winner: true }, standingPlayers[0].id);
            }

            isOver = true;
        }

        const updatedGame = await Game.updateGameById({ isOver }, data.gameId);

        updatedGame.players.forEach((player) => {
            global.io.to(player.socketId).emit('action', {
                type: 'LOSE_GAME',
                data: updatedGame
            });
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function addMalusToSpectre(spectre, malus) {
    return spectre.map(line => {
        const newline = line - malus;

        return newline < 0 ? 0 : newline;
    });
}

async function giveMalus(data, socket) {
    try {
        const game = await Game.getGameById(data.gameId);
        const promises = [];
        const goodPlayer = game.players.find(player => player.id === data.playerId);

        const otherPlayer = game.players.filter(player => player.id !== data.playerId);

        otherPlayer.forEach(player => {
            promises.push(Player.updatePlayerById({
                spectre: addMalusToSpectre(player.spectre, data.malus)
            }, player.id));
        });
        await Promise.all(promises);

        const updatedGame = await Game.getGameById(data.gameId);

        updatedGame.players.forEach((player) => {
            global.io.to(player.socketId).emit('action', {
                type: 'GIVE_MALUS',
                data: {
                    game: updatedGame,
                    malus: (player.id === data.playerId) ? 0 : data.malus,
                    message: (goodPlayer.id !== player.id) ? `${goodPlayer.name} just gave you a malus...` : null
                }
            });
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function restartGame(data, socket) {
    try {
        const newPieceF = await Piece.createPiece();
        const newPieceS = await Piece.createPiece();

        const updatedGame = await Game.updateGameById({
            isOver: false,
            isStarted: false,
            pieces: [newPieceF.id, newPieceS.id]
        }, data.gameId);

        const promises = [];

        updatedGame.players.forEach(player => {
            promises.push(Player.updatePlayerById({
                looser: false,
                winner: false,
                curPiece: 0,
                malus: 0,
                spectre: [21, 21, 21, 21, 21, 21, 21, 21, 21, 21]
            }, player.id));
        });

        await Promise.all(promises);

        const game = await Game.getGameById(data.gameId);

        game.players.forEach((player) => {
            global.io.to(player.socketId).emit('action', {
                type: 'RESTART_GAME',
                data: game
            });
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function disconnected(data, socket) {
    try {
        const playerInfo = await Player.getPlayerBySocket(socket.id);

        await Player.updatePlayerById({ isDisconnected: true }, playerInfo.id);

        let isOver = false;

        await Player.deletePlayerById(playerInfo.id);

        const {
            players,
            id
        } = await Game.getGameById(playerInfo.gameId);

        if (players.length !== 0) {
            const standingPlayers = filter(players, player => !player.looser);

            if ((standingPlayers.length === 1 && players.length !== 1) || standingPlayers.length === 0) {
                if (standingPlayers.length === 1) {
                    Player.updatePlayerById({ winner: true }, standingPlayers[0].id);
                }

                isOver = true;
            }

            await Player.updatePlayerById({ isVisitor: false }, players[0]._id);
            const updatedGame = await Game.updateGameById({ isOver }, id);

            players.forEach((player) => {
                global.io.to(player.socketId).emit('action', {
                    type: 'DISCONNECTED',
                    data: updatedGame,
                    message: 'Player disconnected'
                });
            });
        } else {
            Game.deleteGameById(id);
        }
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function newPlayer(data, socket) {
    try {
        let game = await Game.getGameByName(data.room);
        let isVisitor = true;

        if (!game) {
            game = await Game.createGame(data.room);
            isVisitor = false;
        }
        if (game.players.length === 5) {
            throw new Error('Too many players');
        }

        if (find(game.players, player => player.name === data.name)) {
            throw new Error('name already taken');
        }

        if (game.isStarted) {
            throw new Error('The game has already started');
        }

        const playerCreated = await Player.createPlayer(data.name, isVisitor, socket.id, game.id);

        game = await Game.updateGameById({ players: game.players.concat(playerCreated.id) }, game.id);
        game.players.forEach((player) => {
            global.io.to(player.socketId).emit('action', {
                type: 'NEW_PLAYER',
                data: game,
                message: 'Player successfully created'
            });
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function startGame(data, socket) {
    try {
        const updatedGame = await Game.updateGameById({ isStarted: true }, data.gameId);

        updatedGame.players.forEach((player) => {
            global.io.to(player.socketId).emit('action', {
                type: 'START_GAME',
                data: updatedGame,
                message: 'Game successfully started'
            });
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}

async function nextTurn(data, socket) {
    try {
        const player = await Player.getPlayerById(data.playerId);
        const updatedPlayer = await Player.updatePlayerById({
            spectre: data.spectre,
            curPiece: player.curPiece + 1
        }, data.playerId);
        const game = await Game.getGameById(data.gameId);

        if (updatedPlayer.curPiece >= game.pieces.length - 1) {
            const piece = await Piece.createPiece();

            game.pieces.push(piece.id);
        }

        const updatedGame = await Game.updateGameById({ pieces: game.pieces }, game.id);

        updatedGame.players.forEach((playeur) => {
            global.io.to(playeur.socketId).emit('action', {
                type: 'NEXT_TURN',
                data: { updatedGame, name: player.name }
            });
        });
    } catch (e) {
        socket.emit('action', {
            type: 'ERROR',
            data: e
        });
    }
}
