import filter   from 'filter-object';

import Game     from '../models/Game.model';
import Piece    from './Piece.controller';
import Player   from './Player.controller';

const permitted = '{room,isOver,isStarted,players,pieces}';

export default class GameController {
    static async createGame(room) {
        try {
            const game = await new Game({ room }).save();

            let count = 10;

            while (count--) {
                const piece = await Piece.createPiece();

                game.pieces.push(piece.id);
            }

            await game.save();

            return game.serialize;
        } catch (err) {
            throw new Error('Error while creating Game');
        }
    }

    static async getGameByName(name) {
        try {
            const game = await Game.findOne({ room: name })
                .populate('pieces')
                .populate('players')
                .exec();

            if (!game) {
                return null;
            }

            return game.serialize;
        } catch (err) {
            throw new Error('Error while getting Game');
        }
    }

    static async getGames() {
        try {
            const games = await Game.find({})
                .populate('pieces')
                .populate('players');

            const allGame = games.map(g => g.serialize);

            return allGame;
        } catch (err) {
            throw new Error('No game to display');
        }
    }

    static async getGameById(gameId) {
        try {
            const game = await Game.findOne({ _id: gameId })
                .populate('pieces')
                .populate('players')
                .exec();

            if (!game) {
                throw new Error('Game not found');
            }

            return game.serialize;
        } catch (err) {
            throw new Error('Error while getting Game');
        }
    }

    static async updateGameById(body, id) {
        try {
            const game = await Game.findByIdAndUpdate(id, { $set: filter(body, permitted) }, { new: true })
                .populate('pieces')
                .populate('players')
                .exec();

            if (!game) {
                throw new Error('Game not found');
            }

            return game.serialize;
        } catch (err) {
            throw new Error('Error while updating Game');
        }
    }

    static async deleteGameById(gameId) {
        try {
            const game = await GameController.getGameById(gameId);

            game.pieces.forEach((piece) => {
                Piece.deletePieceById(piece._id);
            });

            game.players.forEach((player) => {
                Player.deletePlayerById(player._id);
            });

            const res = await Game.remove({ _id: gameId });

            if (!res.result.n) {
                throw new Error('Game not found');
            }
        } catch (err) {
            throw new Error('Error while deleting Game');
        }
    }
}
