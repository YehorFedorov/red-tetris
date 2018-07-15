import Piece from '../models/Piece.model';

const colors = [
    'pink',
    'red',
    'green',
    'gold',
    'purple',
    'blue',
    'grey'
];

const types = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

function rotate(shape) {
    const newShape = [];

    shape.forEach((line, i) => {
        line.forEach((bloc, j) => {
            if (!newShape[j]) {
                newShape[j] = [];
            }

            newShape[j][line.length - i - 1] = shape[i][j];
        });
    });

    return newShape;
}

function random(nb) {
    return Math.floor(Math.random() * nb);
}

export default class PieceController {
    static async createPiece() {
        try {
            const piece = {};
            const type =  random(7);

            piece.shape = types[type];
            piece.color = colors[type];

            const rotation = random(4);

            let i = 0;

            while (i++ <= rotation) {
                piece.shape = rotate(piece.shape);
            }


            piece.positionX = random(7);
            piece.positionY = -piece.shape.length;

            const newPiece = await new Piece(piece).save();

            return newPiece.serialize;
        } catch (e) {
            throw new Error('Error while creating a Piece');
        }
    }

    static async deletePieceById(pieceId) {
        try {
            await Piece.remove({ _id: pieceId });
        } catch (err) {
            throw new Error('Error while deleting Piece');
        }
    }
}
