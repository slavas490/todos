import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/todos');
mongoose.Promise = Promise;  

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("DB connected"));

export default db;