//import mongoose from 'mongoose';
const mongoose = require('mongoose');
//import { StringDecoder } from 'string_decoder';

const Schema = mongoose.Schema;

let User = new Schema({
    first_name: {
        type: String,
        required: true,
        dropDups: true
    },
    last_name: {
        type: String,
        required: true,
        default: ""
    },
    employee_id: {
        type: Number,
        required: true,
        unique: true,
        dropDups: true
    }
});

let Project = new Schema({
    project_name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    start_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    priority: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    }
});


let ParentTask = new Schema({
    parent_task: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    }
});

let Task = new Schema({
    task: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    },
    status: {
        type: Boolean,
        default: false
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'ParentTask',
        required: false
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    }
});

//export default mongoose.model('Task', Task);
module.exports.Task = mongoose.model('Task', Task);
module.exports.Project = mongoose.model('Project', Project);
module.exports.User = mongoose.model('User', User);
module.exports.Parent = mongoose.model('ParentTask', ParentTask);