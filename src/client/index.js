import 'babel-core/register';
import 'babel-polyfill';
import {
    createStore,
    applyMiddleware,
    combineReducers,
    compose
} from 'redux';
import thunk from 'redux-thunk';

import React        from 'react';
import ReactDom     from 'react-dom';
import { Provider } from 'react-redux';
import {
    Router,
    Route,
    browserHistory
} from 'react-router';
import {
    syncHistoryWithStore,
    routerReducer
} from 'react-router-redux';

import io from 'socket.io-client';

import socketIoMiddleWare   from './middleware/socketIoMiddleWare';
import reducer              from './reducers';
import App                  from './containers/app';

function configureStore(socket) {
    return createStore(
        combineReducers({
            routing: routerReducer,
            game: reducer
        }),
        composeEnhancers(applyMiddleware(socketIoMiddleWare(socket), thunk)),
    );
}

const socket = io('localhost:5000');
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = configureStore(socket);
const history = syncHistoryWithStore(browserHistory, store);

ReactDom.render((
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={App} />
        </Router>
    </Provider>
), document.getElementById('tetris'));
