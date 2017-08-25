// user

const user = {
    login () {
        return { type: 'USER_LOGIN' }
    }
}

// projects

const project = {
    init (data) {
        return { type: 'PROJECT_INIT', data }
    },
    add (data) {
        return { type: 'PROJECT_ADD', data: { _id: data._id, ...data } }
    },
    change (data) {
        return { type: 'PROJECT_CHANGE', data: data }
    },
    delete (data) {
        return { type: 'PROJECT_DELETE', data: data }
    }
}

// tasks

const task = {
    init (data) {
        return { type: 'TASK_INIT', data }
    },
    add (data) {
        return { type: 'TASK_ADD', data: { _id: data._id, ...data } }
    },
    change (data) {
        return { type: 'TASK_CHANGE', data }
    },
    delete (data) {
        return { type: 'TASK_DELETE', data }
    },
    done (data) {
        return { type: 'TASK_DONE', data }
    }
}

export {
    user,
    project,
    task
}