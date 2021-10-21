import {Schema, model} from 'mongoose'

const noteSchema = new Schema({
    owner: Number,
    title: String,
    content: String
},{
    timestamps: true,
    versionKey: false
})

export default model('Note',noteSchema);