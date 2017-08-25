import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class dFilter extends Component {
	constructor(props) {
		super(props)

		this.state = {
            err: 0,
            form: { }
        }
        
        this.dispatch = this.props.dispatch
    }

	render() {
        const props = this.props
        
        let _today = new Date()
        _today.setHours(0,0,0,0)
        
        // today tasks
        const getTasksToday = () => {
            return props.tasks.filter(el => {
                if(!el.state) {
                    return false
                }

                let dayStart = new Date(), dayEnd = new Date(), elDate = new Date(el.date)
                dayStart.setHours(0,0,0,0)
                dayEnd.setHours(23,59,59,999)
                return (elDate>=dayStart && elDate<=dayEnd)
            }).length
        }

        // week tasks
        const getTasksWeek = () => {
            return props.tasks.filter(el => {
                if(!el.state) {
                    return false
                }
                
                let tomorrow = new Date(), elDate = new Date(el.date)
                tomorrow.setHours(0,0,0,0)
                tomorrow = new Date(tomorrow.getTime()+86400000)
                return (elDate>tomorrow && elDate<=(tomorrow.getTime()+604800000))
            }).length
        }

        const tasksToday = getTasksToday(), tasksNextWeek = getTasksWeek()

		return (
            <ul className="filterDay">
                <li><Link to="/">Today { tasksToday>0 && <span className="count">({tasksToday})</span>}</Link></li>
                <li><Link to="/week">Next 7 days { tasksNextWeek>0 && <span className="count">({tasksNextWeek})</span>}</Link></li>
            </ul>
		)
	}
}

export default connect(store => store)(dFilter)