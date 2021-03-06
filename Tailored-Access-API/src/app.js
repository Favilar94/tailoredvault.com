import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import filesRoutes from "./routes/files.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import relationShipsRoutes from "./routes/relationships.routes";
require('dotenv').config()

const path = require("path");
const app = express();

//Settings
app.set("pkg", pkg);
app.set("port", process.env.PORT_BACKEND);



// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());   


//Routes
app.get("/api", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});


app.use("/api/files", filesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/relation",relationShipsRoutes);

//Static files
app.use(express.static(path.join(__dirname, "public")));

export default app;
