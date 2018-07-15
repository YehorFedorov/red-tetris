import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import Modal                from 'react-modal';

import './style.scss';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        background            : '',
        border                : '',
        transform             : 'translate(-50%, -50%)'
    }
};

export default class ServerPage extends Component {
    static propTypes = {
        router      : PropTypes.object,
        getGames    : PropTypes.func,
        openModal   : PropTypes.func,
        currentRoom : PropTypes.string,
        games       : PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        modal       : PropTypes.bool
    }

    handleNewPlayerFormSubmit = () => {
        const {
            router,
            openModal,
            currentRoom,
            modal
        } = this.props;
        const Name = document.getElementById('Name').value;

        openModal({ modal: !modal, currentRoom: null });
        router.push(`#${currentRoom}[${Name}]`);
    }

    handleNewServerFormSubmit = () => {
        const {
            router
        } = this.props;
        const hostName = document.getElementById('hostName').value;
        const roomName = document.getElementById('roomName').value;

        if (hostName !== '' && roomName !== '') {
            router.push(`#${roomName}[${hostName}]`);
        }
    }

    handleButtonClick = () => {
        this.props.getGames();
    }

    handleRequestClose = () => {
        const { modal, openModal } = this.props;

        openModal({ modal: !modal, currentRoom: null });
    }

    render() {
        const {
            openModal,
            games,
            modal
        } = this.props;

        return (
            <div className='room'>
                <button className='indexServer' onClick={this.handleButtonClick}>
                    join a room
                </button>
                <Modal
                    isOpen={modal}
                    style={customStyles}
                    onRequestClose={this.handleRequestClose}
                    contentLabel='Name Modal'
                >
                    <form
                        className='formModal'
                        onSubmit={this.handleNewPlayerFormSubmit}
                    >
                        <input
                            className='inputText'
                            type='text'
                            id='Name'
                            placeholder='Name'
                        />
                        <input
                            className='input'
                            type='submit'
                            value='GO'
                        />
                    </form>
                </Modal>
                <div className='server'>
                    {
                        games &&
                            (games.map((p, i) => {
                                const players = p.get('players').toJS();
                                let str = p.get('room');

                                if (str.length >= 10) {
                                    str = `${str.slice(0, 10)}...`;
                                }

                                if (!p.get('isStarted')) {
                                    return (
                                        <button
                                            className='notStarted'
                                            key={i}
                                            onClick={openModal.bind(this, {
                                                modal: !modal,
                                                currentRoom: p.get('room')
                                            })}
                                        >
                                            <p>{str}</p>
                                            <p>{`${players.length}/5`} </p>
                                        </button>
                                    );
                                }

                                return (
                                    <button
                                        className='disabled asStarted'
                                        key={i}
                                    >
                                        <p>{str}</p>
                                        <p>{`${players.length}/5`} </p>
                                    </button>
                                );
                            }))
                    }
                </div>
                <p className='or'> or </p>
                <div className='form'>
                    <legend className='legend'>
                        Create your room
                    </legend>
                    <input
                        className='inputText'
                        type='text'
                        id='hostName'
                        placeholder='Host Name'
                    />
                    <input
                        className='inputText'
                        type='text'
                        id='roomName'
                        placeholder='Room Name'
                    />
                    <button className='input' type='submit' onClick={this.handleNewServerFormSubmit}>
                        GO
                    </button>
                </div>
            </div>
        );
    }
}
