import pool from '../database'
const fs = require("fs");
const path = require("path");
import config from "../config";

export const createUser = async (req, res) => {

}

export const getUsers = async (req, res) => {
    const response = await pool.query('SELECT user_name, about, member_since, last_conection, MB_used, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id FROM Users;');
    res.status(200).json(response.rows);
}

export const getUser = async (req, res) => {
    let response
    if (req.profilePryvacyID >= req.relationWithUser){
        response = await pool.query('SELECT user_name, about, member_since, last_conection, MB_used, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id FROM Users WHERE user_id = $1;', [req.params.userID]);
    }else{
        response = await pool.query('SELECT user_name, about FROM Users WHERE user_id = $1;', [req.params.userID]);
    }
    res.status(200).json(response.rows);
}
export const updateUser = async (req, res) => {

}


export const deleteUser = async (req, res) => {
    const userID = req.params.userID;
    let userName = await pool.query('SELECT user_name FROM Users WHERE user_id = $1;', [userID]);
    userName = userName.rows[0]["user_name"]
    const filePath = path.join(config.savePath, "public", userName);
    console.log(filePath);
    try{
        fs.rmSync(filePath, {recursive: true, force: true});
        const response = await pool.query('DELETE FROM Users WHERE user_id = $1;', [userID]);
        res.status(204).json({ message: "Deleted" });
    }catch(err){
        console.log(err)
        res.status(404).json({ message: "Error" });
    }
}






    
