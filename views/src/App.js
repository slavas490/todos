import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { browserHistory } from 'react-router'
import reducers from './reducers'
import * as components from './pages'

let store = createStore(reducers)

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logined: false
		}

		store.subscribe(() => {
			const state = store.getState();
			this.setState({ logined: state.user.logined });
		})
	}

	render() {
		return (
			<Provider store={store}>
				<Router>
					<div>
						{
							!this.state.logined
							?
								<Switch>
									<Route path='/' exact component={components.Login} />
									{/* <Route path='/signin' exact component={components.Register} /> */}
								</Switch>
							:
								<button onClick={this.click2}>LogOUT</button>
						}
					</div>
				</Router>
			</Provider>
		)
	}
}

export default App
