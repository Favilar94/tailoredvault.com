import pool from '../database'
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const fs = require("fs");
import config from "../config";


export const uploadFile = async (req, res) => {
    const userID = req.userID;
    const userName = req.userName;
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          
          const filePath = path.join(config.savePath, "public", userName);
          try {
            if (!fs.existsSync(filePath)) {
              fs.mkdir(filePath, (err) => {
                if (err) return console.error(err);
                console.log("Directory created successfully");
              });
              fs.mkdir(path.join(filePath,"thumbnails"), (err) => {
                if (err) return console.error(err);
                console.log("Thumbnails directory created successfully");
              });
            }
          } catch (err) {
          }
          cb(null, filePath);
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      });
      const upload = multer({ storage }).array("file", 50)

    upload(req, res, function (err){
        if (err instanceof multer.MulterError){
            console.log("Multer Error");
        }else if (err){
            console.log("Unknow error");
        }
        const {description, privacyID} = req.body;

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
                            const staticPath = config.WEB_HOSTNAME + "/" + userName + "/" + fileName;
                            const staticThumbnailPath = config.WEB_HOSTNAME + "/" + userName + "/" + "thumbnails" + fileName;
                            const values = [fileName,mbSize,fileExtension,description,staticPath,staticThumbnailPath,spectRatio,userID,privacyID];
                            try{
                                const response = await pool.query('INSERT INTO Files (file_name,MB_size, file_extension, description, original_path, thumbnail_path, spect_ratio, user_id, privacy_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);',values)
                            }catch (errorSQL){
                                res.status(404).json({ message: "Error" });
                            }
                        }
                    });
                }catch(error){
                    console.log(error);
                }
            }
    
        };
        res.status(201).json({ message: "Uploaded" });

    });
}

export const getFiles = async (req, res) => {
    try{
        const response = await pool.query('SELECT * FROM Files WHERE user_id = $1 AND privacy_id >= $2;', [req.params.userID,req.relationWithUser]);
        res.status(200).json(response.rows);
    }catch(err){
        res.status(404).json({ message: "Error" });
    }

}

export const getFileById = async (req, res) => {
    try{
        const response = await pool.query('SELECT * FROM Files WHERE file_id = $1;', [req.params.fileID]);
        res.status(200).json(response.rows);
    }catch(err){
        res.status(404).json({ message: "Error" });
    }

}

export const updateFileById = async (req, res) => {

    const {description, privacyID} = req.body;
    const fileID = req.params.fileID;

    try{
        const response = await pool.query('UPDATE Files SET description = $1, privacy_id = $2 WHERE file_id = $3;', [description, privacyID,fileID]);
        res.status(204).json({ message: "Updated" });
    }catch(err){
        res.status(404).json({ message: "Error" });
    }

}

export const deleteFileById = async (req, res) => {
    const fileID = req.params.fileID;
    const filePaths = await pool.query('SELECT original_path, thumbnail_path FROM Files WHERE file_id = $1;', [fileID]);

    for(const file of filePaths.rows){
        try{
            fs.unlinkSync(file["original_path"]);
            fs.unlinkSync(file["thumbnail_path"]);
            const response = await pool.query('DELETE FROM Files WHERE file_id = $1;', [fileID]);
            res.status(204).json({ message: "Deleted" });
        }catch(err){
            res.status(404).json({ message: "Error" });
        }
    }
}