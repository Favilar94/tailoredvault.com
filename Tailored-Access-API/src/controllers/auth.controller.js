import pool from '../database'
import jwt from 'jsonwebtoken'
import config from '../config'

export const signUp = async (req, res) => {
    const {user_name,about,user_password,first_name,last_name,email,plan_id,rol_id,privacy_id} = req.body;
    const values = [user_name.toLowerCase(),about,user_password,first_name,last_name,email.toLowerCase(),plan_id,rol_id,privacy_id];

    try{
        const response = await pool.query("INSERT INTO Users (user_name,about,user_password,first_name,last_name,email,plan_id,rol_id,privacy_id) VALUES($1,$2,crypt($3,gen_salt('bf')),$4,$5,$6,$7,$8,$9);",values);
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
export const signIn = async (req, res) => {
    const {email, user_password} = req.body;
    
    const responseUserID = await pool.query("SELECT user_id FROM users WHERE email = $1 AND user_password = crypt($2, user_password)",[email.toLowerCase(),user_password]);
    let userID = responseUserID.rows[0];

    if(!userID){
        return res.status(400).json({message: "User or password incorrect"});
    } 
    else {
        userID = userID['user_id'];
    }
    //Si no encuentra nada es que o no existe el usuario o el password esta mal
    const token = jwt.sign({id: userID}, config.SECRET, {
        expiresIn: 86400
    });
    res.json({token});

}


