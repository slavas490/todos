const reducer = (state = [], action) => {
	switch (action.type) {
        case 'PROJECT_INIT':
            return action.data
		case 'PROJECT_ADD':
            return [ ...state, action.data ]
        case 'PROJECT_CHANGE':
            return state.map((el) => {
                    if(el._id == action.data._id) {
                        el.name = action.data.name
                        el.color = action.data.color 
                    }

                    return el
                })
        case 'PROJECT_DELETE':
            return state.filter((el) => {
                    return el._id !== action.data
                })
        default:
            return state
	}
}

export default reducer