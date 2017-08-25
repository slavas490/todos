import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ajax from '../utils/ajax'
import * as actions from '../actions'
import * as components from '.'

class Home extends Component {
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
		return (
			<div className="Home">
                <div className="header">
                    <span className="title">TODO</span>
                    <Link to="/archive" className="archive">Archive</Link>
                </div>
                <div className="content">
                    <div>
                        <components.dFilter />
                        <components.Projects {...this.props} />
                    </div>
                    <div>
                        <components.Tasks {...this.props} />
                    </div>
                    <div></div>
                </div>
			</div>
		)
	}
}

export default connect(store => store)(Home)
