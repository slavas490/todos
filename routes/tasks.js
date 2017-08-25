import express from 'express'
import mongoose from 'mongoose'
import user from './user'
import * as models from '../models'

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router()

// add task

router.post('/', (req, res) => {
    let task = req.body

    models.projects.findById(task.project)
    .then(out => {
        if(out) {
            return new models.tasks(task).save()
        }
        else {
            res.err('project not found')
        }
    })
    .then(out=>{
        if(!out.errors) {
            res.ok(out._id)
        }
        else {
            res.err()
        }
    })
})

// get tasks

router.get('/', (req, res) => {
    let userID = ObjectId(req.session.userID)

    models.projects.aggregate([
        { 
            $match: {
                user: userID
            } 
        },
        { 
            $lookup: {
                from: "tasks",
                localField: "_id",
                foreignField: "project",
                as: "tasks"
            }
        }
    ])
    .then(out => {
        if(out) {
            let arr = []

            out.forEach(el => {
                arr = arr.concat(el.tasks)
            })

            res.ok(arr)
        }
        res.err()
    })
})

// update the task

router.put('/:pid', (req, res) => {
    let pars = req.body

    models.tasks.findById(req.params.pid)
    .populate({path: 'project', populate: {path : 'user'}})
    .exec()
    .then(out => {
        if(out && out.project && out.project.user._id == req.session.userID) {
            if(!Object.keys(pars).length) {
                out.state = false
            }
            else {
                out.name = pars.name
                out.state = pars.state
                out.priority = pars.priority
                out.date = pars.date
                out.project = pars.project
            }
            
            out.save()
            res.ok(out)
        }
        else {
            res.err('wrong task')
        }
    })
})

// delete the task

router.delete('/:pid', (req, res) => {
    models.tasks.findById(req.params.pid)
    .populate({path: 'project', populate: {path : 'user'}})
    .exec()
    .then(out => {
        if(out && out.project && out.project.user._id == req.session.userID) {
            out.remove()
            res.ok()
        }
        else{
            res.err('wrong task')
        }
    })
})

export default router
