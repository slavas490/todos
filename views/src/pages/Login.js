import React, { Component } from 'react'
import { createStore } from 'redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'

class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logined: false
		}

		this.dispatch = this.props.dispatch;

		// store.subscribe(() => {
		// 	const state = store.getState();
		// 	this.setState({ logined: state.user.logined });
		// });
	}

	render() {
		return (
			<Router>
				<div className="Entry">
					<form>
						<div className="title">Login</div>

						<div className="row">
							<label>Username:</label>
							<input type="text"/>
						</div>
						<div className="row">
							<label>Password:</label>
							<input type="password"/>
						</div>
						<div className="row">
							<input type="submit" className="btn" value="Login" />
						</div>
					</form>
				</div>
			</Router>
		)
	}
}

export default connect()(Login);
