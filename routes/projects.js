import express from 'express'
import mongoose from 'mongoose'
import user from './user'
import * as models from '../models'

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router()

// add project

router.post('/', (req, res) => {
    let proj = req.body

    models.user.findById(req.session.userID)
    .then(out => {
        if(out) {
            return models.projects.find({ user:out._id, name: proj.name })
        }
        else {
            res.err('user not found')
        }
    })
    .then(out => {
        if(out.length) {
            res.err('project already exists', 2)
            return false
        }

        return new models.projects({ user: req.session.userID, ...proj }).save()
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

// get projects

router.get('/', (req, res) => {
    models.projects.aggregate([
        { $match: { user: ObjectId(req.session.userID) } },
        { $project: { name: "$name", color: "$color" } }
    ])
    .then(out => {
        res.ok(out)
    })
})

// update the project

router.put('/:pid', (req, res) => {
    let pars = req.body,
        userID = req.session.userID
    
    if(!Object.keys(pars).length) {
        res.err('empty request')
        return false
    }

    models.projects.findOne({ user: userID, name: pars.name })
    .then(out => {
        if(out && out._id != req.params.pid) {
            res.err('project name already exists')
            return false
        }
        else {
            return models.projects.findById(req.params.pid)
        }
    })
    .then(out => {
        if(out && out.user == userID) {
            out.name = pars.name
            out.color = pars.color
            out.save()

            res.ok(out)
        }
    })
})

// delete the project

router.delete('/:pid', (req, res) => {
    models.projects.findOne({ user: req.session.userID, _id: req.params.pid })
    .remove()
    .then(out => {
        if(out.result && out.result.n) {
            res.ok()
        }
        else{
            res.err()
        }
    })
})

export default router
