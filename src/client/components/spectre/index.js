import React, { Component } from 'react';
import PropTypes            from 'prop-types';

import './style.scss';

export default class SpectreGame extends Component {
    static propTypes = {
        player  : PropTypes.object,
        board   : PropTypes.object
    }

    render() {
        const {
            player,
            board
        } = this.props;

        const spectre = player.get('spectre');
        const name = player.get('name');
        const winner = player.get('winner');
        const looser = player.get('looser');

        return (
            <div className='spectre'>
                <p className='name'>{name}</p>
                {
                    board.map((line, j) => {
                        return (j === 0) ? ('') : (
                            <div key={j} className={`Sline ${(looser || winner) ? ' blur' : ''}`}>
                                {
                                    spectre.map((s, i) => {
                                        if (s <= j) {
                                            return (<div key={`${i} ${j}`} className={'Sbloc gold'} />);
                                        }

                                        return (<div key={`${i} ${j}`} className={'Sbloc white'} />);
                                    })
                                }
                            </div>
                        );
                    })
                }
                {
                    (looser || winner) && (
                        <h1 className='Smessage'>{winner ? 'WINNER' : 'LOOSER'}</h1>
                    )
                }
            </div>
        );
    }
}
