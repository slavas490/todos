const reducer = (state = [], action) => {
	switch (action.type) {
        case 'TASK_INIT':
            return action.data
		case 'TASK_ADD':
            return [...state, action.data]
        case 'TASK_CHANGE':
            return state.map((el) => {
                if(el._id == action.data._id) {
                    el.name = action.data.name,
                    el.state = action.data.state,
                    el.priority = action.data.priority,
                    el.date = action.data.date,
                    el.project = action.data.project
                }

                return el
            })
        case 'TASK_DELETE':
            return state.filter((el) => {
                return el._id !== action.data
            })
        case 'TASK_DONE':
            return state.map((el) => {
                if(el._id == action.data) {
                    el.state = false
                }

                return el
            })
        default:
            return state
	}
}

export default reducer