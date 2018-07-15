import { connect }  from 'react-redux';

import startGame    from './../actions/startGame';
import Room         from './../components/room';

function mapStateToProps(state) {
    return {
        room: state.game.getIn([ 'room' ]),
        info: state.game.getIn([ 'info' ]),
        players: state.game.getIn(['room', 'players'])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        startGame: (data) => dispatch(startGame(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
