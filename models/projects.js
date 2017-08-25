import mongoose from 'mongoose'

const Schema = mongoose.Schema

let schema = mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    name: String,
    color: String
})

export default mongoose.model('projects', schema)