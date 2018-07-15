import { connect } from 'react-redux';

import newPlayer    from '../actions/newPlayer';
import App          from './../components/App.js';

function mapStateToProps(state) {
    const info = state.game.getIn([ 'info' ]);
    const error = state.game.getIn([ 'error' ]);
    const room = state.game.getIn([ 'room' ]);
    const players = room && room.get('players');
    const otherPlayers = players && players.filter(player => player.get('name') !== info.get('name'));
    const board = state.game.getIn([ 'board' ]);

    return {
        room,
        info,
        error,
        otherPlayers,
        board
    };
}

function mapDispatchToProps(dispatch) {
    return {
        newPlayer: (data) => dispatch(newPlayer(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
