import mongoose from 'mongoose'

const Schema = mongoose.Schema

let schema = mongoose.Schema({
    project: { type: Schema.Types.ObjectId, ref: 'projects' },
    state: Boolean,
    name: String,
    priority: Number,
    date: Date
})

export default mongoose.model('tasks', schema)