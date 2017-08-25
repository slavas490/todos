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
import AlertContainer from 'react-alert'

import iSuccess from './images/success.png'
import iError from './images/error.png'

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
		let alertOptions = {
			offset: 14,
			position: 'top right',
			theme: 'dark',
			time: 5000,
			transition: 'fade'
		}

		let aMsg = this.msg

		const alert = {
			err (data) {
				if(!data || !data.length) {
					data = 'some error occurred. please, try again later'
				}
				aMsg.show(data, { icon: <img src={iError} alt='error' />})
			},
			ok (data) {
				aMsg.show(data, { icon: <img src={iSuccess} alt='ok' />})
			}
		}

		return (
			<Provider store={store}>
				<Router history={history}>
					{ 
						this.state._load &&
							<div>
								<AlertContainer ref={a => this.msg = a} {...alertOptions} />
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
										<components.Home {...this.props} history={history} alert={alert} />
								}
							</div>
					}
				</Router>
			</Provider>
		)
	}
}

export default App
