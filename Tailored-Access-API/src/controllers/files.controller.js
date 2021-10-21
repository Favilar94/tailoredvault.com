import Note from '../models/Note'
import pool from '../database'
const path = require("path");

export const createNote = async (req, res) => {
    const {owner,title,content } = req.body;
    const newNote = new Note({owner,title,content});
    const noteSaved = await newNote.save();
    res.status(201).json(noteSaved);
}

export const uploadFile = (req, res) => {
    const file_description = req.body.description;
    const username = req.body.username;
    const privacyID = req.body.privacyID;
    const customShare = req.body.customShare;
    const userID = req.body.userID; //Computar

    req.files.forEach(element => {
        const fileName = element["filename"];
        const mbSize = element["size"]/1024/1024;
        const fileExtension = path.extname(fileName);
        const filePath = element["path"];

        
        const thumbnailPath = 0; //Computar
        const spectRatio =0; //Computar
        
        console.log(fileName,mbSize,fileExtension,file_description,filePath,thumbnailPath,spectRatio,userID,privacyID,customShare);
    });

    res.json("Uploaded");
}

export const getFiles = async (req, res) => {
    const response = await pool.query('SELECT * FROM users');
    console.log(response.rows);
    res.status(201).json("Archivos");
}

export const getFileById = (req, res) => {
    
}

export const updateFileById = (req, res) => {
    
}

export const deleteFileById = (req, res) => {
    
}