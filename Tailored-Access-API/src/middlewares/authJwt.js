import pool from "../database";
import jwt from "jsonwebtoken";
import config from "../config";
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).json({ message: "No token provided" });
        const decoded = jwt.verify(token, config.SECRET);
        const responseUserID = await pool.query("SELECT user_name FROM users WHERE user_id = $1",[decoded.id]);
        let userName = responseUserID.rows[0];
        if (!userName) {
            return res.status(404).json({ message: "No user found" });
        } else {
            userName = userName["user_name"];
            req.userID = decoded.id;
            req.userName = userName;
            next();
        }

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const isAdmin = async (req, res, next) => {
    console.log(req.userID)
    next();

}

export const isOwner = async (req, res, next) => {
    try{
        console.log(req.body);

        // const fileOwner = 

        const responseUserID = await pool.query("SELECT user_id FROM users WHERE user_name = $1",[fileOwner]);
        let userID = responseUserID.rows[0];
        if (!userID) {
            return res.status(404).json({ message: "Not valid operation" });
        } else {
            userID = userID["user_id"];
        }
        if(req.userID == userID){
            req.Owner = true;
            next();
        }else{
            req.Owner = false;
            next();
        }
    }catch(err){
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const isVisitor = async (req, res, next) => {
    console.log(req.userID)
    next();

}