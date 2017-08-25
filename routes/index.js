import express from 'express';
import user from './user'
import projects from './projects'
import tasks from './tasks'

const router = express.Router()

router.use((req, res, next) => {
	res.ok = (data) => {
		res.send({ err:0, text: "OK", data })
	}

	res.err = (text = '', err = 1) => {
		res.send({ text, err });
	}

	next()
})


// User
router.use('/user', user)

// Projects
router.use('/projects', projects)

// Tasks
router.use('/tasks', tasks)


export default router
