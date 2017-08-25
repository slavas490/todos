import mongoose from 'mongoose'

let schema = mongoose.Schema({
    username: String,
    pass: String
})

export default mongoose.model('user', schema)