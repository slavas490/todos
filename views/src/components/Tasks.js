import React, { Component } from 'react'
import { connect } from 'react-redux'
import ajax from '../utils/ajax'
import * as actions from '../actions'
import Select from 'react-select'
    import 'react-select/dist/react-select.css'
import DatePicker from 'react-datepicker'
    import 'react-datepicker/dist/react-datepicker.css'
    import moment from 'moment';


class Tasks extends Component {
	constructor(props) {
		super(props)

		this.state = {
            _showForm: false,
            filter: null
        }

        props.historyEvent(location => {
            this.formFlush()
            this.filterChange(location)
        })
        
        this.dispatch = props.dispatch
        this.formFlush = this.formFlush.bind(this)
        this.addTaskShow = this.addTaskShow.bind(this)
        this.taskCreate = this.taskCreate.bind(this)
        this.taskUpdate = this.taskUpdate.bind(this)
        this.taskEdit = this.taskEdit.bind(this)
        this.taskDelete = this.taskDelete.bind(this)
        this.taskDone = this.taskDone.bind(this)
        this.filterChange = this.filterChange.bind(this)
    }

    componentDidMount () {
        ajax.get('/tasks')
        .then(out => {
            if(out && out.data) {
                this.dispatch(actions.task.init(out.data))
            }
        })

        this.filterChange(window.location)
    }

    formFlush () {
        this.setState({
            _showForm: false,
            _project: null,
            _priority: null,
            _date: null,
            _state: null,
            _name: '',
            _edit_id: null
        })
    }

    addTaskShow (show = true) {
        if(typeof show === "object" || show) {
            this.setState({ _showForm: true })
        }
        else {
            this.formFlush()
        }
    }

    task () {
        const state = this.state
        
        return {
            name: state._name,
            priority: state._priority,
            project: state._project,
            state: state._state,
            date: state._date ? state._date.startOf('day').utc() : null
        }
    }

    taskCreate (e) {
        e.preventDefault()

        if(this.state._edit_id) {
            this.taskUpdate()
            return false
        }

        let task = this.task()
        
        ajax.post('/tasks', task)
        .then(out => {
            if(!out.err) {
                task._id = out.data;
                this.dispatch(actions.task.add(task))
                this.formFlush()
            }
        })
    }

    taskEdit (e, id) {
        e.preventDefault()

        let task = this.props.tasks.find(el => el._id == id)

        if(!task) {
            return false
        }
        
        this.setState({
            _edit_id: id,
            _showForm: true,
            _name: task.name,
            _state: +task.state,
            _priority: task.priority,
            _date: moment(task.date),
            _project: task.project
        })
    }

    taskUpdate () {
        ajax.put('/tasks/'+this.state._edit_id, this.task())
        .then(out => {
            if(!out.err) {
                this.dispatch(actions.task.change(out.data))
                this.formFlush()
            }
        })
    }

    taskDelete (e, id) {
        e.preventDefault()

        ajax.delete('/tasks/'+id)
        .then(out => {
            if(!out.err) {
                this.dispatch(actions.task.delete(id))
            }
        })
    }

    taskDone (e, id) {
        e.preventDefault()
        
        ajax.put('/tasks/'+id)
        .then(out => {
            if(!out.err) {
                this.dispatch(actions.task.done(id))
            }
        })
    }

    filterChange (location) {
        let link = (location.location ? location.location.pathname : location.pathname).split('/')

        if(link[1] == '') {
            this.setState({ filter: 0 })
        }
        else if(link[1] == 'week') {
            this.setState({ filter: 1 })
        }
        else if(link[1] == 'project') {
            this.setState({ filter: 2, _filter_val: link[2] })
        }
        else if(link[1] == 'archive') {
            this.setState({ filter: 3 })
        }

        return null
    }

	render() {
        const state = this.state, props = this.props

        const _priority_list = [
            { value: 2, label: 'Hight', color: '#ff0000' },
            { value: 1, label: 'Medium', color: '#ffd400' },
            { value: 0, label: 'Low', color: '#d6d6d6' }
        ]
        
        const _states_list = [
            { value: 1, label: 'In process' },
            { value: 0, label: 'Done' }
        ]

        const getPriorityColor = (el) => {
            if(el.exp) {
                el.priority = 2
            }

            let c = _priority_list.find(p => p.value===el.priority)

            return c ? c.color : null
        }

        const getTitle = () => {
            let title = { title: '', date: '' }

            if(state.filter == 0) {
                let date = new Date()

                title.title = 'Today'
                title.date = date.getDate()+' of '+date.toLocaleString("en-us", { month: "short" })
            }
            else if(state.filter == 1) {
                let dateFrom = new Date(),
                    dateTo = new Date(new Date().getTime()+604800000)
                    
                title.title = 'Next 7 days'
                title.date = dateFrom.toLocaleString("en-us", { month: "short" })+' '+dateFrom.getDate()+' - '+dateTo.toLocaleString("en-us", { month: "short" })+' '+dateTo.getDate()
            }
            else if(state.filter == 2) {
                let p = props.projects.find(p => p._id == state._filter_val)
                title.title = p ? 'By project "'+p.name+'"' : ''
            }
            else if(state.filter == 3) {
                title.title = 'Archive'
            }

            return title
        }

        // tasks list
        let list = props.tasks.map(el => {
            if(new Date(el.date) < new Date()-86400000 && state.filter!=3) {
                el.exp = 1
            }
            else {
                el.exp = 0
            }

            return el
        })
        
        // total filter
        let _today = new Date()
        _today.setHours(0,0,0,0)

        list = props.tasks.filter(el => {
            if(state.filter == 3) { // archive
                return !el.state
            }
            else {
                if((new Date(el.date)<_today && !el.state) || !el.state) { // exclude old
                    return false
                }
                else if(state.filter == 1) { // week
                    return (new Date(el.date)>=_today && new Date(el.date)<=(_today.getTime()+604800000))
                }
                else if(state.filter == 2) { // by project
                    return el.project == state._filter_val
                }
                else { // today
                    return (new Date(el.date).getTime()==_today.getTime())
                }
            }
        })

        // sort by priority
        list.sort((a,b) => b.priority - a.priority)

        // expirated goes top
        list.sort((a,b) => b.exp - a.exp)
        
		return (
			<div className="Tasks">
                <div className="title">{getTitle().title} <span className="date">{getTitle().date}</span></div>
                <ul className="task">
                    {
                        list.map((el,i) =>
                            <li key={el._id} className={el.exp?"expirated":""}>
                                <div className="name">
                                    <div className="tLabel" style={{backgroundColor:getPriorityColor(el)}}></div> <div>{el.name}</div>
                                </div>

                                <div className="pWrap">
                                    <div className="pLabel" style={{backgroundColor:props.projects.find(p => p._id===el.project).color}}></div>
                                    <div className="project">{props.projects.find(p => p._id===el.project).name}</div>

                                    <div className="icons">
                                        <div className="icon menu" onClick={e => this.taskEdit(e, el._id)}></div>
                                        { state.filter!=3 && <div className="icon done" onClick={e => this.taskDone(e, el._id)}></div> }
                                        <div className="icon delete" onClick={e => this.taskDelete(e, el._id)}></div>
                                    </div>
                                </div>
                            </li>
                        )
                    }
                </ul>

                <div className="form">
                    { !state._showForm
                        ?
                            <div className="link" onClick={this.addTaskShow}>+ Add task</div>
                        :
                            <form onSubmit={this.taskCreate}>
                                <div className="input-group">
                                    <Select value={state._state} options={_states_list} onChange={val => this.setState({ _state: (val?val.value:null) })} placeholder="State" />
                                    <Select value={state._project} options={props.projects.map(el => { return { value: el._id, label: el.name } })} onChange={val => this.setState({ _project: (val?val.value:null) })} placeholder="Project" />
                                    <input type="text" value={state._name} onChange={e => this.setState({ _name: e.target.value }) } placeholder="Name" />
                                </div>
                                <div className="input-group">
                                    <Select value={state._priority} options={_priority_list} onChange={val => this.setState({ _priority: (val?val.value:null) })} placeholder="Priority" />
                                    <DatePicker todayButton={"Today"} placeholderText="Date" dateFormat="DD/MM/YYYY" selected={state._date} onChange={val => this.setState({ _date: val }) } />
                                    <input type="submit" className="btn" value="OK"/>
                                    <input type="submit" className="btn danger" value="X" onClick={() => this.addTaskShow(false)} />
                                </div>
                            </form>
                    }
                </div>
			</div>
		)
	}
}

export default connect(store => store)(Tasks)
