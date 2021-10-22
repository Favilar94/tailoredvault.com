import Note from '../models/Note'
import pool from '../database'
const path = require("path");
const sharp = require("sharp");


export const createNote = async (req, res) => {
    const {title,content } = req.body;
    const newNote = new Note({title,content});
    const noteSaved = await newNote.save();
    res.status(201).json(noteSaved);
}

export const uploadFile = async (req, res) => {
    const {description, privacyID, customShare} = req.body;
    const userID = req.userID
    const username = req.userName

    for (const element of req.files){
        const fileName = element["filename"];
        const mbSize = element["size"]/1024/1024;
        const fileExtension = path.extname(fileName).replace('.','').toLowerCase();
        const filePath = element["path"];
        let thumbnailPath = null; //Computar
        let spectRatio = null; //Computar

        if(fileExtension == "png" || fileExtension == "jpeg"|| fileExtension == "jpg"){
            thumbnailPath = path.join(element["destination"],"thumbnails", fileName);
            const heightPx=200;
            try {
                    sharp(filePath).resize({fit:sharp.fit.contain, height:heightPx}).toFile(thumbnailPath, async (err, resizeImage) => {
                    if (err){
                        console.log(err);
                    } else{
                        spectRatio = resizeImage.height/resizeImage.width;
                        // insertar En SQL
                        const values = [fileName,mbSize,fileExtension,description,filePath,thumbnailPath,spectRatio,userID,privacyID,customShare];
                        const response = await pool.query('INSERT INTO Files (file_name,MB_size, file_extension, description, original_path, thumbnail_path, spect_ratio, user_id, privacy_id, custom_share) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);',values)
                        console.log(response,"Inserted");
                    }
                });
            }catch(error){
                console.log(error);
            }
        }

    };
    
    res.status(201).json("Uploaded");
}

export const getFiles = async (req, res) => {
    const response = await pool.query('SELECT * FROM Files WHERE user_id = ($1);', [req.params.userID]);
    console.log(response.rows);
    res.status(200).json("Archivos");
}

export const getFileById = async (req, res) => {
    const response = await pool.query('SELECT * FROM Files WHERE file_id = ($1);', [req.params.fileID]);
    console.log(response.rows);
    res.status(200).json("Archivo");
}

export const updateFileById = async (req, res) => {

    const {description, privacyID, customShare} = req.body;
    const fileID = req.params.fileID;

    const response = await pool.query('UPDATE Files SET description = ($1), privacy_id = ($2), custom_share = ($3) WHERE file_id = ($4);', [description, privacyID, customShare,fileID]);
    console.log(response.rows);
    res.status(204).json("Updated");
}

export const deleteFileById = async (req, res) => {
    const fileID = req.params.fileID;
    const response = await pool.query('DELETE FROM Files WHERE ($1);', [fileID]);
    console.log(response.rows);
    res.status(204).json("Deleted");
}