import express from 'express';
import user from './user'
import * as models from '../models'

const router = express.Router()

// login

router.post('/token', (req, res) => {
    const form = req.body
    
    if( !form ) {
        res.err('empty request')
        return false
    }

    models.user.findOne({ username: form.username })
    .then(out => {
        if( out && out.pass == form.pass ) {
            req.session.logined = true
            req.session.userID = out._id
            res.ok()
        }
        else {
            res.err()
        }
    })
})

// check session

router.get('/token', (req, res) => {
    let sess = req.session

    if( sess.logined ) {
        res.ok()
    }
    else {
        res.err()
    }
})


// register

router.post('/', (req, res) => {
    const form = req.body
    
    if( !form ) {
        res.err('empty request')
        return false
    }

    if( form.username.length<6 || form.username.length>32 ) {
        res.err('username must be from 6 to 32 chars length', 2)
        return false
    }

    if( form.pass.length<6 || form.pass.length>16 ) {
        res.err('password must be from 6 to 16 chars length', 3)
        return false
    }

    models.user.find({ username: form.username })
    .then(out => {
        if(out && !out.length) {
            let user = new models.user({ username: form.username, pass: form.pass })
            user.save(err => {
                if(!err) {
                    req.session.logined = true
                    res.ok()
                }
                else res.err('something went wrong', 5)
            });
        }
        else {
            res.err('username already exist', 4)
        }
    })
})

export default router
