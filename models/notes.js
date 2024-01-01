const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const notesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    tag:{
        type:String,
        default: 'general'
    },
    date:{
        type:Date,
        default:Date.now
    },
    pinned:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('notes',notesSchema);