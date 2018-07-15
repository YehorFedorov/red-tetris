import filter from 'filter-object';
import Player from '../models/Player.model';

const permitted = '{name,isVisitor,curPiece,looser,winner,malus,spectre,socketId,gameId,isDisconnected}';

export default class PlayerController {
    static async createPlayer(name, isVisitor, socketId, gameId) {
        try {
            const newPlayer = new Player({ name, isVisitor, socketId, gameId });
            let count = 10;

            while (count--) {
                newPlayer.spectre.push(21);
            }

            await newPlayer.save();

            return newPlayer.serialize;
        } catch (err) {
            throw new Error('Error while creating Player');
        }
    }

    static async getPlayerById(playerId) {
        try {
            const player = await Player.findOne({ _id: playerId });

            if (!player) {
                throw new Error('Player not found');
            }

            return player.serialize;
        } catch (err) {
            throw new Error('Error while getting Player');
        }
    }

    static async getPlayerBySocket(socketId) {
        try {
            const player = await Player.findOne({ socketId });

            if (!player) {
                throw new Error('Player not found');
            }

            return player.serialize;
        } catch (err) {
            throw new Error('Error while getting Player');
        }
    }

    static async updatePlayerById(data, playerId) {
        try {
            const player = await Player.findByIdAndUpdate(playerId, { $set: filter(data, permitted) }, { new: true });

            if (!player) {
                throw new Error('Player not found');
            }

            return player.serialize;
        } catch (err) {
            throw new Error('Error while updating Player');
        }
    }

    static async deletePlayerById(playerId) {
        try {
            await Player.remove({ _id: playerId });
        } catch (err) {
            throw new Error('Error while deleting Player');
        }
    }
}
