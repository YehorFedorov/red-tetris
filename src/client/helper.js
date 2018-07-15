export function isGameLost(board) {
    try {
        const line = board.get(0);
        let ret = false;

        line.forEach(bloc => {
            if (bloc && bloc.get('color') !== 'white') {
                ret = true;
            }
        });

        return ret;
    } catch (e) {
        throw new Error('Error in function isGameLost');
    }
}

export function isPossible(board, shape, posX, posY) {
    try {
        let res = true;

        shape.forEach((line, y) => {
            line.forEach((bloc, x) => {
                const newY = y + posY;
                const newX = x + posX;
                let onBoard = true;
                let free = true;

                if (newY >= 21 || newX < 0 || newX >= 10) {
                    onBoard = false;
                }
                if (onBoard && newY >= 0 && board && board.getIn([newY, newX, 'color']) !== 'white') {
                    free = false;
                }
                if (shape[y][x] === 1 && (!onBoard || !free)) {
                    res = false;
                }
            });
        });

        return res;
    } catch (e) {
        throw new Error('Error in function isPossible');
    }
}

export function newLine() {
    const res = [];
    let count = 0;

    while (count++ < 10) {
        res.push({ color: 'white' });
    }

    return res;
}


export function lineDestroyer(board, giveMalus, playerId, gameId) {
    try {
        const newTab = board.toJS();
        const toRet = [];

        newTab.forEach((line, x) => {
            let checker = 0;

            line.forEach((bloc) => {
                if (bloc.color !== 'white' && bloc.color !== 'black') {
                    checker++;
                }
            });

            if (checker === 10) {
                toRet.push(x);
            }
        });

        if (toRet.length > 1) {
            giveMalus({ playerId, gameId, malus: toRet.length - 1 });
        }
        if (toRet.length !== 0) {
            let count = 0;

            while (count < toRet.length) {
                newTab.splice(toRet[count], 1);
                newTab.unshift(newLine());
                count++;
            }

            return newTab;
        }

        return false;
    } catch (e) {
        throw new Error('Error in line destroyer');
    }
}

export function isPiece(i, j, shape, posX, posY) {
    const x = i - posX;
    const y = j - posY;

    if (x < 0 || x >= shape.length || y < 0 || y >= shape.length) {
        return false;
    }
    if (shape[y][x] === 1) {
        return true;
    }

    return false;
}

export function rotate(shape) {
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

export function pieceToBoard(board, shape, posX, posY, color) {
    try {
        const res = board.toJS();

        board.forEach((line, j) => {
            line.forEach((bloc, i) => {
                if (isPiece(i, j, shape, posX, posY) && (i >= 0 && i < 10 && j >= 0 && j < 21)) {
                    res[j][i].color = color;
                }
            });
        });

        return res;
    } catch (e) {
        throw new Error('Error in function pieceToBoard');
    }
}

export function updateSpectre(newBoard, spectre) {
    try {
        const spectreCopy = spectre;

        spectreCopy.forEach((s, e) => spectreCopy[e] = 21);

        newBoard.forEach((line, j) => {
            line.forEach((bloc, i) => {
                if (bloc.color !== 'white') {
                    spectreCopy[i] = Math.min(spectreCopy[i], j);
                }
            });
        });

        return spectreCopy;
    } catch (e) {
        throw new Error('Error in function updateSpectre');
    }
}
