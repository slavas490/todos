import React, { Component } from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import {  Router, Route, Switch, Redirect } from 'react-router-dom'
import { routerReducer } from 'react-router-redux'
import createBrowserHistory from 'history/createBrowserHistory'
import * as reducers from './reducers'
import * as components from './components'
import * as actions from './actions'
import ajax from './utils/ajax'

const store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	})
)

const history = createBrowserHistory()


class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logined: false,
			_load: false
		}

		store.subscribe(() => {
			const state = store.getState();
			this.setState({ logined: (state.user ? state.user.logined : false) });
		})
	}

	componentDidMount () {
		ajax.get('/user/token')
		.then(out => {
			this.setState({ _load: true })

			if( out && !out.err ) {
				store.dispatch(actions.user.login())
			}
		})
	}

	render() {
		return (
			<Provider store={store}>
				<Router history={history}>
					{ 
						this.state._load &&
							<div>
								{
									!this.state.logined
									?
										<div>
											<Switch>
												<Route exact path="/" component={components.Login} />
												<Route path="/signup" component={components.Register} />
												<Route children={() => <Redirect to="/" />} />
											</Switch>
										</div>
									:
										<components.Home historyEvent={history.listen} />
								}
							</div>
					}
				</Router>
			</Provider>
		)
	}
}

export default App
