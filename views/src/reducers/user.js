const init = {
    logined: false
}

const user = (state = init, action) => {
	switch (action.type) {
		case 'USER_LOGIN':
            return { ...state, logined: true }
        case 'USER_LOGOUT':
            return { ...state, logined: false }
        default:
            return state
	}
}

export default user