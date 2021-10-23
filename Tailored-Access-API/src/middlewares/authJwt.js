import pool from "../database";
import jwt from "jsonwebtoken";
import config from "../config";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).json({ message: "No token provided" });
        const decoded = jwt.verify(token, config.SECRET);
        const responseUserID = await pool.query("SELECT user_name, rol_id, email_validated FROM users WHERE user_id = $1",[decoded.id]);
        let userName = responseUserID.rows[0];
        if (!userName) {
            return res.status(404).json({ message: "No user found" });
        } else {
            userName = userName["user_name"];
            req.userID = decoded.id;
            req.userName = userName;
            req.emailValidated = responseUserID.rows[0]["email_validated"];
            req.rolID = responseUserID.rows[0]["rol_id"];
            req.rightsAccess = []

            if(!req.emailValidated){
                return res.status(200).json({ message: "Email not validated" });
            }else{
                next();
            }
        }

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error:error });
    }
};

export const userRole = async (req, res, next) => {
    const response = await pool.query("SELECT description,r_read,r_update,r_delete,r_create,sysadmin FROM Roles WHERE rol_id = $1",[req.rolID]);
    req.Roles= response.rows[0]
    next();
}

export const canCreate = async (req, res, next) => {
    const {r_create}= req.Roles;
    if(r_create){
        next();
    }else{
        return res.status(403).json({ message: "Forbidden" });
    }

}

export const canRead = async (req, res, next) => {

    const {r_read}= req.Roles;
    if(r_read){
        next();
    }else{
        return res.status(403).json({ message: "Forbidden" });
    }

}
export const canUpdate = async (req, res, next) => {
    const {r_update}= req.Roles;
    if(r_update){
        next();
    }else{
        return res.status(403).json({ message: "Forbidden" });
    }

}
export const canDelete = async (req, res, next) => {
    const {r_delete}= req.Roles;
    if(r_delete){
        next();
    }else{
        return res.status(403).json({ message: "Forbidden" });
    }
}

export const isAdmin = async (req, res, next) => {
    const {sysadmin}= req.Roles;
    if(sysadmin){
        req.relationWithUser = 0;
        req.rightsAccess.push(true);
        next();
    }else{
        req.relationWithUser = null;
        req.rightsAccess.push(false);
        next();
    }

}

export const isOwner = async (req, res, next) => {

    const response = await pool.query("SELECT user_id, privacy_id FROM Files WHERE file_id = $1",[req.params.fileID]);
    const fileMetadata = response.rows;

    if (fileMetadata.length != 0) {
        req.fileOwner = fileMetadata[0]["user_id"];
        req.filePrivacyID = fileMetadata[0]["privacy_id"];
        req.rightsAccess.push(req.userID==req.fileOwner);
        next();
    }else{
        return res.status(404).json({ message: "No file found" });
    }
}

export const isVisitor = async (req, res, next) => {
    if(req.rightsAccess.indexOf(true) !== -1){
        next();
    }else{
        const responsePrivacy = await pool.query("SELECT description,is_personal,friends,friends_friends,everyone FROM Pryvacy_Options WHERE privacy_id = $1",[req.filePrivacyID]);
        const {description, is_personal, friends, friends_friends, everyone} = responsePrivacy.rows[0];
       
        if (is_personal) {
            return res.status(403).json({ message: "Forbidden" });
        }else if (everyone){
            req.rightsAccess.push(true);
            next();
        }else if (friends || friends_friends){
            const response = await pool.query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true",[req.fileOwner, req.userID]);
            const relationValues = response.rows;

            if (relationValues.length > 0 ) {
                req.rightsAccess.push(true);
                next();
            }else if (friends_friends){
                const responsefriends = await pool.query("SELECT user_ID2 FROM Relationships WHERE user_ID1 = $1 AND status = true", [req.fileOwner]);
                const AllfriendsList = responsefriends.rows;
                let friendOfFriend = false;
                for(const friendOfTheOwner of AllfriendsList){
                    const friend=friendOfTheOwner["user_id2"];
                    const responseRelation = await pool.query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true",[friend, req.userID]);
                    const relationShipFounded = responseRelation.rows;
                    if(!(relationShipFounded.length < 1)){
                        friendOfFriend = true;
                    }
                };
                if(friendOfFriend){
                    req.rightsAccess.push(true);
                    next();
                }else{
                    return res.status(403).json({ message: "Forbidden" });
                }

            } else {
                return res.status(403).json({ message: "Forbidden" });;
            }
        }
    }
     
}

export const isOwnerProfile = async (req, res, next) => {
    if(req.params.userID == req.userID){
        req.relationWithUser = 1;
        req.rightsAccess.push(true);
        next();
    }else{
        req.rightsAccess.push(false);
        next();
    }
}
export const isVisitorProfile = async (req, res, next) => {

    if(req.rightsAccess.indexOf(true) !== -1){
        next();
    }else{
            const response = await pool.query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true",[req.params.userID, req.userID]);
            const relationValues = response.rows;

            if (relationValues.length > 0) {
                req.relationWithUser = 2;
                req.rightsAccess.push(true);
                next();
            }else{
                const responsefriends = await pool.query("SELECT user_ID2 FROM Relationships WHERE user_ID1 = $1 AND status = true", [req.params.userID]);
                const AllfriendsList = responsefriends.rows;
                let friendOfFriend = false;
                for(const friendOfTheOwner of AllfriendsList){
                    const friend = friendOfTheOwner["user_id2"];
                    const responseRelation = await pool.query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true",[friend, req.userID]);
                    const relationShipFounded = responseRelation.rows;
                    if(!(relationShipFounded.length < 1)){
                        friendOfFriend = true;
                    }
                };
                if(friendOfFriend){
                    req.relationWithUser = 3;
                    req.rightsAccess.push(true);
                    next();
                }else{
                    req.relationWithUser = 4;
                    req.rightsAccess.push(true);
                    next()
                }

            } 
    }


}

export const checkAccess = async (req, res, next) => {
    if(req.rightsAccess.indexOf(true) !== -1){
        next();
    }else{
        return res.status(403).json({ message: "Forbidden" });
    }
}

export const profilePrivacy = async (req, res, next) => {

    const response = await pool.query('SELECT privacy_id FROM Users WHERE user_id = $1', [req.params.userID]);

    if(response.rows[0]){
        req.profilePryvacyID = response.rows[0]["privacy_id"]
        next();
    }else{
        return res.status(404).json({ message: "User not found" });
    }


}
