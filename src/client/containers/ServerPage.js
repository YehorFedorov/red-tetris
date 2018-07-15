import { connect }  from 'react-redux';

import getGames     from './../actions/getGames';
import openModal    from './../actions/openModal';

import ServerPage   from './../components/serverPage';

function mapStateToProps(state) {
    return {
        currentRoom: state.game.getIn([ 'currentRoom' ]) || '',
        modal: state.game.getIn([ 'modal' ]),
        games: state.game.getIn([ 'games' ]) || [],
        room: state.game.getIn([ 'room' ]),
        info: state.game.getIn([ 'info' ]),
        players: state.game.getIn(['room', 'players'])
    };
}


function mapDispatchToProps(dispatch) {
    return {
        openModal: (data) => dispatch(openModal(data)),
        getGames: (data) => dispatch(getGames(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerPage);
