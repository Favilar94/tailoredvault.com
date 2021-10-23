import pool from '../database'

export const createRelation = async (req, res) => {
    const {user_ID1,user_ID2,status} = req.body;
    try{
        if (req.relationWithUser == 0){
            const values1 = [user_ID1,user_ID2,status];
            const values2 = [user_ID2,user_ID1,status];

            const response = await pool.query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2,$3);",values1);
            const response2 = await pool.query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2,$3);",values2);

            res.status(200).json({ message: "Created" });
        }else{
            if(user_ID1==req.userID || user_ID2 == req.userID){
                const values1 = [user_ID1,user_ID2];
                const values2 = [user_ID2,user_ID1];
                const response = await pool.query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2);",values1);
                const respons2 = await pool.query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2);",values2);

                res.status(200).json({ message: "Created" });
            }else{
                res.status(403).json({ message: "Forbidden" });
            }

        }
    }catch (err){
        res.status(404).json({ message: "Error" });
    }

}

export const getRelations = async (req, res) => {
    try{
        if (req.profilePryvacyID >= req.relationWithUser){
            const response = await pool.query('SELECT user_ID2 FROM Relationships WHERE user_ID1 = $1 AND status = true;', [req.params.userID]);
            res.status(200).json(response.rows);
        }else{
            res.status(403).json({ message: "Forbidden" });
        }
    }catch (err){
        res.status(404).json({ message: "Error" });
    }

}
export const updateRelation = async (req, res) => {
    try{
        const {status} = req.body;
        const relationID = req.params.relationID;

        const responseRelationExists = await pool.query("SELECT user_ID1, user_ID2 FROM Relationships WHERE relation_id = $1;",[relationID]);        
        if(responseRelationExists.rows.length > 0){
            if(responseRelationExists.rows[0]["user_id1"] == req.userID || responseRelationExists.rows[0]["user_id2"] == req.userID || req.relationWithUser == 0){
                const response = await pool.query('UPDATE Relationships SET status = $1 WHERE relation_id = $2;', [status, relationID ]);
                res.status(204).json({ message: "Updated" });
            }else{
                return res.status(401).json({ message: "Unauthorized", error:error });
            }
        }else{
            return res.status(404).json({ message: "No found" });
        }

    }catch (err){
        res.status(404).json({ message: "Error" });
    }

}


export const deleteRelation = async (req, res) => {
    try{
        const relationID = req.params.relationID;

        const responseRelationExists = await pool.query("SELECT user_ID1, user_ID2 FROM Relationships WHERE relation_id = $1;",[relationID]);        
        if(responseRelationExists.rows.length > 0){
            if(responseRelationExists.rows[0]["user_id1"] == req.userID || responseRelationExists.rows[0]["user_id2"] == req.userID || req.relationWithUser == 0){
                const response = await pool.query('DELETE FROM Relationships WHERE relation_id = $1;', [relationID ]);
                res.status(204).json({ message: "Deleted" });
            }else{
                return res.status(401).json({ message: "Unauthorized", error:error });
            }
        }else{
            return res.status(404).json({ message: "No found" });
        }

    }catch (err){
        res.status(404).json({ message: "Error" });
    }

}
