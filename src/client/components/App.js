import React, { Component } from 'react';
import PropTypes            from 'prop-types';

import Spectre      from '../components/spectre';
import BoardGame    from './../containers/BoardGame';
import Room         from './../containers/Room';
import ServerPage   from './../containers/ServerPage';

import './style.scss';

export default class App extends Component {
    static propTypes = {
        room            : PropTypes.object,
        info            : PropTypes.object,
        error           : PropTypes.object,
        otherPlayers    : PropTypes.object,
        board           : PropTypes.object,
        router          : PropTypes.object
    }

    render() {
        const {
            room,
            info,
            error,
            otherPlayers,
            board,
            router
        } = this.props;
        const data = info && { name: info.getIn([ 'name' ]), room: info.getIn([ 'room' ]) };

        const errorCondition = (error || !data);
        const roomCondition = !errorCondition && room && !room.getIn([ 'isStarted' ]);
        const gameCondition = !errorCondition && room && room.getIn([ 'isStarted' ]);

        const errorMessage = error ? error : 'The URL is invalid, please use: #<room>[<player_name>]';

        return (
            <div className='container'>
                <header>
                    <h1> <a href='http://localhost:8080/'>{'Red-Tetris'}</a></h1>
                </header>
                <div className='content'>
                    <div className='center'>
                        {
                            errorCondition &&
                            <div className='error'>
                                <p>{errorMessage}</p>
                            </div>
                        }
                        {
                            !roomCondition && !gameCondition &&
                                <ServerPage {...this.props} router={router} />
                        }
                    </div>
                    {
                        otherPlayers && (
                        <div className='spectre--container'>
                            {otherPlayers.size >= 1 && (<Spectre player={otherPlayers.get(0)} board={board} />)}
                            {otherPlayers.size >= 2 && (<Spectre player={otherPlayers.get(1)} board={board} />)}
                        </div>)
                    }
                    {
                        roomCondition && <Room />
                    }
                    {
                        gameCondition && <BoardGame />
                    }
                    {
                        otherPlayers && (
                            <div className='spectre--container'>
                                { otherPlayers.size >= 3 && (<Spectre player={otherPlayers.get(2)} board={board} />) }
                                { otherPlayers.size >= 4 && (<Spectre player={otherPlayers.get(3)} board={board} />) }
                            </div>)
                    }
                </div>
                <footer>
                    <h1>{'Swag'}</h1>
                </footer>
            </div>
        );
    }
}
