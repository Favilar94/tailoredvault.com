import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import filesRoutes from "./routes/files.routes";

const path = require("path");
const app = express();
const fs = require("fs");

//Settings
app.set("pkg", pkg);
app.set("port", 3000);

app.set("views", path.join(__dirname, "views")); //Only to debug
app.set("view engine", "ejs"); //Only to debug

// middlewares
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userName = req.body.username;
    const filePath = path.join(__dirname, "public", userName);
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
      console.log("An error occurred");
    }
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
app.use(multer({ storage }).array("file", 50));

//Routes
app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.get("/apifoto", (req, res) => { //Only to debug
  res.render("fileform"); //Only to debug
}); //Only to debug

app.get("/userform", (req, res) => { //Only to debug
  res.render("index"); //Only to debug
}); //Only to debug

app.use("/files", filesRoutes);

//Static files
app.use(express.static(path.join(__dirname, "public")));

export default app;
