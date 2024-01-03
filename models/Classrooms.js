const mongoose = require('mongoose');

const ClassroommanagementSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    school:{
        type: String,
        required: true
    },
    campus:{
        type: String,
        required: true
    },
    building:{
        type: String,
        required: true
    },
    floor:{
        type: Number,
        required: true
    }
})


const ClassroomModel = mongoose.model('classrooms', ClassroommanagementSchema);


module.exports = ClassroomModel;