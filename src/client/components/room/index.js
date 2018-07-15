import React, { Component } from 'react';
import PropTypes            from 'prop-types';

import './style.scss';

export default class Room extends Component {
    static propTypes = {
        room        : PropTypes.object,
        info        : PropTypes.object,
        players     : PropTypes.object,
        startGame   : PropTypes.func
    }

    render() {
        const {
            room,
            info,
            players,
            startGame
        } = this.props;
        const currentPlayer = players.find(player => player.getIn([ 'name' ]) === info.getIn([ 'name' ]));
        const number = players.size;
        const disabled = currentPlayer.getIn([ 'isVisitor' ]);

        return (
            <div className='room'>
                <button
                    onClick={disabled ? '' : startGame.bind(this, { gameId: room.getIn([ 'id' ]) })}
                    className={disabled ? 'disabled' : ''}
                >
                    <i className='ion-play' style={{ fontSize: '6vh' }} />
                    <p>Start Game<br />{number}/5</p>
                </button>
            </div>
        );
    }
}
