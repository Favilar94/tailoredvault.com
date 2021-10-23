import pool from '../database'
const fs = require("fs");
const path = require("path");
import config from "../config";

export const createUser = async (req, res) => {
    const {user_name,about,user_password,first_name,last_name,email,email_validated,plan_id,rol_id,privacy_id} = req.body;
    const values = [user_name.toLowerCase(),about,user_password,first_name,last_name,email.toLowerCase(),email_validated,plan_id,rol_id,privacy_id];
    try{
        const response = await pool.query("INSERT INTO Users (user_name,about,user_password,first_name,last_name,email,email_validated,plan_id,rol_id,privacy_id) VALUES($1,$2,crypt($3,gen_salt('bf')),$4,$5,$6,$7,$8,$9,$10);",values);
    }catch (err){
        res.status(400).json({"error":"Email or User in use"})
    }
    // La base de datos valida si no existe el email ni el username Programar manejo de errores
    const responseUserID = await pool.query("SELECT user_id FROM users WHERE user_name = $1",[user_name.toLowerCase()]);
    const userID = responseUserID.rows[0]['user_id'];
    const token = jwt.sign({id: userID}, config.SECRET, {
        expiresIn: 86400
    })
    res.status(200).json({token})
}

export const getUsers = async (req, res) => {

    try{
        if (req.relationWithUsern == 0){
            const response = await pool.query('SELECT user_name, about, member_since, last_conection, MB_used, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id FROM Users;');
            res.status(200).json(response.rows);
        }else{
            const response = await pool.query('SELECT user_name, about FROM Users;');
            res.status(200).json(response.rows);
        }
    }catch (err){
        res.status(404).json({ message: "Error" });
    }


}

export const getUser = async (req, res) => {
    let response;
    if (req.profilePryvacyID >= req.relationWithUser){
        response = await pool.query('SELECT user_name, about, member_since, last_conection, MB_used, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id FROM Users WHERE user_id = $1;', [req.params.userID]);
    }else{
        response = await pool.query('SELECT user_name, about FROM Users WHERE user_id = $1;', [req.params.userID]);
    }
    res.status(200).json(response.rows);
}

export const updateUser = async (req, res) => {
    try{
        const {about,first_name,last_name,email_validated,plan_id,rol_id,privacy_id} = req.body;
        const updateUserID = req.params.userID
        if(relationWithUser ==0){
            const valuesToUpdate = [about,first_name,last_name,email_validated,plan_id,rol_id,privacy_id,updateUserID];
            const response = await pool.query('UPDATE Users SET about = $1, first_name = $2, last_name = $3, email_validated = $4, plan_id = $5 ,rol_id = $6, privacy_id = $7 WHERE user_id = $8;', valuesToUpdate);
            res.status(204).json({ message: "Updated" });
        }else if(relationWithUser == 1){
            const valuesToUpdate = [about,first_name,last_name,privacy_id,updateUserID];
            const response = await pool.query('UPDATE Users SET about = $1, first_name = $2, last_name = $3, privacy_id = $4 WHERE user_id = $5;', valuesToUpdate);
            res.status(204).json({ message: "Updated" });
        }else{
            res.status(404).json({ message: "Error" });
        }
    }catch(err){
        res.status(404).json({ message: "Error" });

    }

    
}

export const deleteUser = async (req, res) => {
    const userID = req.params.userID;
    let userName = await pool.query('SELECT user_name FROM Users WHERE user_id = $1;', [userID]);
    userName = userName.rows[0]["user_name"]
    const filePath = path.join(config.savePath, "public", userName);
    try{
        fs.rmSync(filePath, {recursive: true, force: true});
        const response = await pool.query('DELETE FROM Users WHERE user_id = $1;', [userID]);
        res.status(204).json({ message: "Deleted" });
    }catch(err){
        res.status(404).json({ message: "Error" });
    }
}






    
