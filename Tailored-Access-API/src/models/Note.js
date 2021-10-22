import {Schema, model} from 'mongoose'

const noteSchema = new Schema({
    title: String,
    content: String
},{
    timestamps: true,
    versionKey: false
})

export default model('Note',noteSchema);