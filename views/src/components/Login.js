import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ajax from '../utils/ajax'
import * as actions from '../actions'

class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
            err: 0,
            form: { }
		}
		
        this.dispatch = this.props.dispatch
        this.submit = this.submit.bind(this)
	}

	submit (e) {
        e.preventDefault()

        this.setState({ err: 0 })

        ajax.post('/user/token', this.state.form)
        .then(out => {
            if(out.err) {
                this.setState({ err: out.err })
            }
            else {
                this.dispatch(actions.user.login())
            }
        })
    }

	render() {
		const state = this.state

		return (
			<div className="Entry">
				<form onSubmit={this.submit}>
					<div className="title">Login</div>

					{ state.err>0 && <div className="alert warn">Sorry, but user not found</div> }

					<div className="row">
						<label>Username:</label>
						<input onChange={(e) => this.setState({ form: {...state.form, username: e.target.value} })} placeholder="Username" className="icon login" type="text"/>
					</div>
					<div className="row">
						<label>Password:</label>
						<input onChange={(e) => this.setState({ form: {...state.form, pass: e.target.value} })} placeholder="Password" className="icon pass" type="password"/>
					</div>
					<div className="row">
						<input type="submit" className="btn" value="Login" />
					</div>
					<div className="row">
						<Link to="/signup">Don't have profile?</Link>
					</div>
				</form>
			</div>
		)
	}
}

export default connect()(Login)
