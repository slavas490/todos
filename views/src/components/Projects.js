import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ajax from '../utils/ajax'
import * as actions from '../actions'
import { GithubPicker } from 'react-color';


class Projects extends Component {
	constructor(props) {
		super(props)

		this.state = {
            _showForm: false,
            _showColorPicker: false,
            _labelColor: '#b80000',
            _edit_id: null,
            _pName: '',
        }
        
        props.history.listen(location => {
            this.formFlush()
            this.changeActiveProject(location)
        })
        
        this.alert = this.props.alert
        this.dispatch = this.props.dispatch
        this.formFlush = this.formFlush.bind(this)
        this.addProjectShow = this.addProjectShow.bind(this)
        this.colorPickerToggle = this.colorPickerToggle.bind(this)
        this.colorPickerChange = this.colorPickerChange.bind(this)
        this.projectCreate = this.projectCreate.bind(this)
        this.projectEdit = this.projectEdit.bind(this)
        this.projectUpdate = this.projectUpdate.bind(this)
        this.projectDelete = this.projectDelete.bind(this)
        this.changeActiveProject = this.changeActiveProject.bind(this)
    }

    componentDidMount () {
        ajax.get('/projects')
        .then(out => {
            if(out && out.data) {
                this.dispatch(actions.project.init(out.data))
            }
        })

        this.changeActiveProject(window.location)
    }

    formFlush () {
        this.setState({
            _showForm: false,
            _showColorPicker: false,
            _labelColor: '#b80000',
            _edit_id: null,
            _pName: ''
        })
    }
    
    addProjectShow (show = true) {
        if(typeof show === "object" || show) {
            this.setState({ _showForm: true })
        }
        else {
            this.formFlush()
        }
    }

    colorPickerToggle () {
        this.setState({ _showColorPicker: !this.state._showColorPicker })
    }

    colorPickerChange (color) {
        this.setState({ _labelColor: color.hex })
    }

    project () {
        return {
            color: this.state._labelColor,
            name: this.state._pName
        }
    }

    projectCreate (e) {
        e.preventDefault()

        if(this.state._edit_id) {
            this.projectUpdate()
            return false
        }

        let project = this.project()
        
        if( !project.name.length ) {
            this.alert.err('project name is required')
            return false
        }

        ajax.post('/projects', project)
        .then(out => {
            if(!out.err) {
                project._id = out.data;
                this.dispatch(actions.project.add(project))
                this.formFlush()
                this.alert.ok('project successfully created')
            }
            else {
                this.alert.err(out.text)
            }
        })
    }

    projectEdit (e, id) {
        e.preventDefault()

        let project = this.props.projects.find(el => el._id == id)

        if(!project) {
            return false
        }
        
        this.setState({
            _edit_id: id,
            _showForm: true,
            _pName: project.name,
            _labelColor: project.color
        })
    }

    projectUpdate () {
        ajax.put('/projects/'+this.state._edit_id, this.project())
        .then(out => {
            if(!out.err) {
                this.dispatch(actions.project.change(out.data))
                this.formFlush()
            }
            else {
                this.alert.err(out.text)
            }
        })
    }

    projectDelete (e, id) {
        e.preventDefault()

        const props = this.props
        
        ajax.delete('/projects/'+id)
        .then(out => {
            if(!out.err) {
                this.dispatch(actions.project.delete(id))
                this.dispatch(actions.task.deleteByProjectId(id))
                this.alert.ok('project successfully removed')

                let active_url = props.history.location.pathname.split('/')
                
                if(active_url[1]=='project' && active_url[2]==this.state.activeProject) {
                    props.history.push('/')
                }
            }
            else {
                this.alert.err(out.text)
            }
        })
    }

    changeActiveProject (location) {
        let link = (location.location ? location.location.pathname : location.pathname).split('/')

        if(link[1] == 'project') {
            this.setState({ activeProject: link[2] })
        }
        else {
            this.setState({ activeProject: null })
        }
    }

	render() {
        const state = this.state, props = this.props

        // tasks by project
        const getTasksByProject = (pid) => {
            return props.tasks.filter(el => {
                return el.project == pid && el.state
            }).length
        }

		return (
			<div className="Projects">
                <div className="title">Projects</div>
                <ul>
                    {
                        props.projects.map((el,i) => {
                            const tCount = getTasksByProject(el._id)

                            return <li key={el._id}>
                                    <Link to={"/project/"+el._id} className={state.activeProject==el._id?"highliht":""}>
                                        <span><span style={{background:el.color}} className="color"></span> {el.name}</span>
                                        <div className="tCount">{tCount>0?tCount:''}</div>
                                        <div className="icons">
                                            <div className="icon menu" onClick={e => this.projectEdit(e, el._id)}></div>
                                            <div className="icon delete" onClick={e => this.projectDelete(e, el._id)}></div>
                                        </div>
                                    </Link>
                                </li>
                            }
                        )
                    }
                </ul>

                <div className="newProject">
                    {   !state._showForm
                        ?
                            <div className="link" onClick={this.addProjectShow}>+ Add project</div>
                        :
                            <form onSubmit={this.projectCreate}>
                                <div className="colorSelector" style={{backgroundColor:state._labelColor}} onClick={this.colorPickerToggle}>
                                    <div style={{display:state._showColorPicker?"block":"none"}}>
                                        <GithubPicker triangle="top-left" onSwatchHover={this.colorPickerChange} onChangeComplete={this.colorPickerChange} />
                                    </div>
                                </div>
                                <div>
                                    <input type="text" placeholder="Name" onChange={e => this.setState({ _pName: e.target.value })} value={state._pName} className="name"/>
                                </div>
                                <input type="submit" className="btn" value="OK"/>
                                <input type="submit" onClick={() => this.addProjectShow(false)} className="btn danger" value="X"/>
                            </form>
                    }
                </div>
			</div>
		)
	}
}

export default connect(store => store)(Projects)
